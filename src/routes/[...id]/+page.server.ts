import { backlinks, notes } from '$lib/db/schema';
import { useProcessor } from '$lib/markdown';
import { error, type Actions, type ServerLoad } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export const load = async ({ locals, params, platform, url }) => {
	console.log({ params });

	const [id, ...extra] = params.id.split('/');

	const t0 = Date.now();
	const n = (
		await locals.db
			.select()
			.from(notes)
			.where(eq(notes.id, id as string))
	).at(0);
	console.log('load notes took', Date.now() - t0);

	const t1 = Date.now();

	const outgoingLinks = await locals.db
		.select({
			target: backlinks.target,
			target_text: backlinks.target_text,
			title: notes.title,
			r2_key: notes.r2_key
		})
		.from(backlinks)
		.leftJoin(notes, eq(backlinks.target, notes.id))
		.where(eq(backlinks.source, id as string));

	console.log('load outgoing links took', Date.now() - t1);

	const t2 = Date.now();
	const incomingLinks = await locals.db
		.select({
			source: backlinks.source,
			title: notes.title,
			context: backlinks.context,
			r2_key: notes.r2_key
		})
		.from(backlinks)
		.innerJoin(notes, sql`backlinks.source = notes.id`)
		.where(sql`backlinks.target = ${id}`);

	console.log('load incoming links took', Date.now() - t2);

	// now lookup in r2

	if (!n || !n.r2_key || !platform) {
		throw error(404, 'Note not found');
	}

	const t3 = Date.now();
	const note = await platform.env.BUCKET.get(n.r2_key);
	const body = await note?.text();

	const processor = useProcessor(
		outgoingLinks.map((l) => ({
			id: l.target ?? '',
			slug: l.target_text ?? ''
		}))
	);

	const vfile = await processor.process(body);

	console.log('load note content took', Date.now() - t3);

	async function getOutgoingLinksContent() {
		const t0 = Date.now();
		const outgoingLinksContent = await Promise.all(
			outgoingLinks
				.map(async (l) => {
					if (!l.r2_key) return;
					const note = await platform?.env.BUCKET.get(l.r2_key);
					const content = await note?.text();
					// TODO: new processor, new links
					const vFile = await processor.process(content);
					return {
						id: l.target,
						title: l.title,
						content,
						html: String(vFile)
					};
				})
				.filter(Boolean)
		);
		console.log('load outgoing links content took', Date.now() - t0);
		return outgoingLinksContent as NonNullable<(typeof outgoingLinksContent)[number]>[];
	}

	const stack = url.searchParams.get('stack')?.split(',') ?? [];

	const stackedNotes = async () => {
		const t0 = Date.now();

		const stacked = await Promise.all(
			stack
				.map(async (id) => {
					const n = (await locals.db.select().from(notes).where(eq(notes.id, id))).at(0);

					if (!n || !n.r2_key || !platform) {
						return;
					}

					return n;
				})
				.filter(Boolean)
		);

		console.log('load stacked notes took', Date.now() - t0);

		return stacked;
	};

	const stackedNotesContent = async () => {
		const t0 = Date.now();
		const stacked = await Promise.all(
			stack.map(async (id) => {
				const note = await platform.env.BUCKET.get(`notes/${id}`);
				const body = await note?.text();

				const vfile = await processor.process(body);

				return [id, String(vfile)];

				// return {
				// 	id,
				// 	html: String(vfile)
				// };
			})
		);

		console.log('load stacked notes content took', Date.now() - t0);
		return stacked;
	};

	return {
		note: {
			id: n.id,
			title: n.title,
			content: body,
			html: String(vfile)
		},
		outgoingLinks,
		incomingLinks: (async () => {
			// get incoming link data
			// const incomingLinks =
			// TODO: get html from incoming links
			const t0 = Date.now();
			const notes = await Promise.all(
				incomingLinks
					.map(async (l) => {
						if (!l.context) return;
						const vfile = await processor.process(l.context);
						// TODO: this should actually just strip the wikilink formatting
						const html = String(vfile);
						return {
							source: l.source,
							title: l.title,
							context: l.context,
							html
						};
					})
					.filter(Boolean)
			);

			console.log('load incoming links content took', Date.now() - t0);
			return notes as NonNullable<(typeof notes)[number]>[];
		})(),
		incomingLinksContent: (async () => {
			// get incoming link data
			const t0 = Date.now();
			const outgoingLinksContent = await Promise.all(
				incomingLinks
					.map(async (l) => {
						if (!l.r2_key) return;
						const note = await platform?.env.BUCKET.get(l.r2_key);
						const content = await note?.text();
						// TODO: new processor, new links
						const vFile = await processor.process(content);
						return {
							...l,
							content,
							html: String(vFile)
						};
					})
					.filter(Boolean)
			);
			console.log('load incoming links content took', Date.now() - t0);
			return outgoingLinksContent as NonNullable<(typeof outgoingLinksContent)[number]>[];
		})(),
		outgoingLinksContent: getOutgoingLinksContent(),
		stackedNotes: stack.length
			? await stackedNotes().then((s) => {
					// if (!s.some((s) => s?.id === n.id)) {
					// 	return s.filter(Boolean).concat(n);
					// }
					return s.filter(Boolean);
				})
			: undefined,
		stackedNoteContent: stack.length
			? await stackedNotesContent().then((c) => Object.fromEntries(c))
			: undefined
	};
};

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const content = data.get('content') as string;

		if (title && content) {
			// await locals.db
			// 	.update(notes)
			// 	.set({
			// 		title,
			// 		content,
			// 		updated_at: new Date()
			// 	})
		}
	}
};
