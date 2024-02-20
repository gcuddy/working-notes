import { trpc } from '$lib/trpc';

export async function load({ fetch, parent }) {
	const { queryClient } = await parent();

	const client = trpc({
		fetch,
		queryClient
	});

	return {
		notes: await client.notes.list.createServerQuery()
	};
}
