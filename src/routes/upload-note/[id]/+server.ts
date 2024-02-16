import { notes } from '$lib/db/schema';

export const PUT = async ({ locals, request, params, platform }) => {
	try {
		// TODO: validator
		const data = (await request.json()) as {
			title: string;
			content: string;
		};

		console.dir({ data, platform }, { depth: null });

		if (platform?.env.BUCKET) {
			// console.log('HELLO', data, platform.env.BUCKET);

			const a = await platform.env.BUCKET.put(`notes/${params.id}`, data.content);
			const key = a?.key;
			if (key) {
				await locals.db
					.insert(notes)
					.values({
						id: params.id,
						title: data.title,
						r2_key: key,
						created_at: new Date(),
						updated_at: new Date()
					})
					.onConflictDoUpdate({
						target: [notes.id],
						set: {
							title: data.title,
							r2_key: key,
							updated_at: new Date()
						}
					});
			}
		}

		// await platform?.env.BUCKET.put(`notes/${params.id}`, data);

		return new Response('OK');
	} catch (e) {
		console.error(e);
		return new Response('Error', { status: 500 });
	}
};
