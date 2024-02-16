import { notes } from '$lib/db/schema';
import type { Actions, ServerLoad } from '@sveltejs/kit';

import { nanoid } from 'nanoid';
export const load = (async ({ locals }) => {
	console.time('load notes');
	const n = await locals.db.select().from(notes);
	console.timeEnd('load notes');
	return {
		notes: n
	};
}) satisfies ServerLoad;

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const content = data.get('content') as string;

		if (title && content) {
			await locals.db.insert(notes).values({
				id: nanoid(),
				title,
				content,
				created_at: Date.now(),
				updated_at: Date.now()
			});
		}
	}
};
