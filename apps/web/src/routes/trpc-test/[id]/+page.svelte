<script lang="ts">
	import Note from '$lib/components/note.svelte';
	import * as query from '$lib/utils/query';

	let { data } = $props();

	let noteData = data.note();

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
	<Note note={$noteData.data} />
{:else}
	<p>Something went wrong</p>
{/if}
