import { trpc } from '$lib/trpc';

export async function load({ parent, fetch, params, url }) {
	const { queryClient } = await parent();

	const client = trpc({
		fetch,
		queryClient
	});

	const stack = url.searchParams.get('stack')?.split(',') ?? [];
	if (!stack.includes(params.id)) stack.push(params.id);

	return {
		note: await client.notes.note.createServerQuery(params.id),
		stack
	};
}
