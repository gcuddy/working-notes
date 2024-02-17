import { notes } from '$lib/db/schema';

export async function load({ locals, platform }) {
	// const t0 = Date.now();

	const listed = await locals.db.select().from(notes);

	// const list = await platform?.env?.BUCKET.list();

	// const t1 = Date.now();

	// console.log(`list took ${t1 - t0}ms`);

	// console.log({ list });

	return {
		notes: listed
		// notes: list?.objects.reverse().map((o) => {
		// 	return {
		// 		key: o.key,
		// 		text: o.uploaded
		// 	};
		// })
	};
}
