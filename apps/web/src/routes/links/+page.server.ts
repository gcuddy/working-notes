import { backlinks } from '$lib/db/schema';

export async function load({ locals }) {
	const allLinks = await locals.db.select().from(backlinks);

	return {
		allLinks
	};
}
