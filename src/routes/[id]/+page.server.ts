import { backlinks, notes } from '$lib/db/schema';
import { useProcessor } from '$lib/markdown';
import { error, type Actions, type ServerLoad } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export const load = async ({ locals, params, platform }) => {
	const n = (
		await locals.db
			.select()
			.from(notes)
			.where(eq(notes.id, params.id as string))
	).at(0);

	const outgoingLinks = await locals.db
		.select({
			target: backlinks.target,
			target_text: backlinks.target_text,
			title: notes.title,
			r2_key: notes.r2_key
		})
		.from(backlinks)
		.leftJoin(notes, eq(backlinks.target, notes.id))
		.where(eq(backlinks.source, params.id as string));

	const incomingLinks = await locals.db
		.select({
			source: backlinks.source,
			title: notes.title,
			context: backlinks.context,
			r2_key: notes.r2_key
		})
		.from(backlinks)
		.innerJoin(notes, sql`backlinks.source = notes.id`)
		.where(sql`backlinks.target = ${params.id}`);

	// now lookup in r2

	if (!n || !n.r2_key || !platform) {
		throw error(404, 'Note not found');
	}
	const note = await platform.env.BUCKET.get(n.r2_key);
	const body = await note?.text();

	console.log({ outgoingLinks });
	const processor = useProcessor(
		outgoingLinks.map((l) => ({
			id: l.target ?? '',
			slug: l.target_text ?? ''
		}))
	);

	const vfile = await processor.process(body);

	async function getOutgoingLinksContent() {
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
		return outgoingLinksContent as NonNullable<(typeof outgoingLinksContent)[number]>[];
	}

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
			return await Promise.all(
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
		})(),
		incomingLinksContent: (async () => {
			// get incoming link data
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
			return outgoingLinksContent as NonNullable<(typeof outgoingLinksContent)[number]>[];
		})(),
		outgoingLinksContent: getOutgoingLinksContent()
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
			// 	.where(eq(notes.id, params.id as string));
		}
	}
};
