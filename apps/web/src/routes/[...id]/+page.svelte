<script lang="ts">
	import Note from '$lib/components/note.svelte';
	import * as query from '$lib/utils/query';

	// let { data } = $props();
	export let data;

	// have to use old svelte 4 syntax for now (to be reactive)

	$: noteData = data.note();

	// $effect(() => {
	// 	console.log({ data, note:  data.note() });
	// 	noteData = data.note();
	// });
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
