<script lang="ts">
	import { trpc } from '$lib/trpc';
	import * as query from '$lib/utils/query';

	const noteData = trpc().notes.note.createQuery('3getk5kr8hk');

	$effect(() => {
		console.log({ $noteData });
	});
</script>

{#if query.error($noteData)}
	<p>{$noteData.failureReason.message}</p>
{:else if query.loading($noteData)}
	<p>Loading...</p>
{:else if query.empty($noteData)}
	nothing found
{:else if query.success($noteData)}
	{JSON.stringify($noteData.data, null, 2)}
{:else}
	<p>Something went wrong</p>
{/if}
