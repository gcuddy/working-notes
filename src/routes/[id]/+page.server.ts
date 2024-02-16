import { backlinks, notes } from '$lib/db/schema';
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
		.select()
		.from(backlinks)
		.where(eq(backlinks.source, params.id as string));

	const incomingLinks = await locals.db
		.select({
			source: backlinks.source,
			title: notes.title,
			context: backlinks.context
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
	return {
		note: {
			id: n.id,
			title: n.title,
			content: body
		},
		outgoingLinks,
		incomingLinks
	};
};

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const content = data.get('content') as string;

		if (title && content) {
			await locals.db
				.update(notes)
				.set({
					title,
					content,
					updated_at: Date.now()
				})
				.where(eq(notes.id, params.id as string));
		}
	}
};
