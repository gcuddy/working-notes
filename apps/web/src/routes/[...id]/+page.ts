import { trpc } from '$lib/trpc';

export async function load({ parent, fetch, params, url }) {
	const [id] = params.id.split('/');
	const { queryClient } = await parent();

	const client = trpc({
		fetch,
		queryClient
	});

	const stack = url.searchParams.get('stack')?.split(',') ?? [];
	if (!stack.includes(id)) stack.push(id);

	return {
		note: await client.notes.note.createServerQuery(id),
		stack
	};
}
