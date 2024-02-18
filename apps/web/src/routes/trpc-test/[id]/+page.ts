import { trpc } from '$lib/trpc';

export async function load({ parent, fetch, params }) {
	const { queryClient } = await parent();

	const client = trpc({
		fetch,
		queryClient
	});

	return {
		note: await client.notes.note.createServerQuery(params.id)
	};
}
