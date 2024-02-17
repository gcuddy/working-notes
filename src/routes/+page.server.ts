import { notes } from '$lib/db/schema';
import type { ServerLoad } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	console.time('load notes');
	const n = await locals.db.select().from(notes);
	console.timeEnd('load notes');
	return {
		notes: n
	};
}) satisfies ServerLoad;
