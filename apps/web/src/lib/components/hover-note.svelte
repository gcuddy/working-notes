<script lang="ts">
	import { trpc } from '$lib/trpc';
	import { type Writable } from 'svelte/store';
	import * as query from '$lib/utils/query';
	// export let action: (node: HTMLElement) => {};

	let { action, arrow, noteId, title } = $props<{
		action: (node: HTMLElement) => void;
		arrow?: Writable<HTMLElement | null>;
		// children: Snippet;
		noteId: string;
		title?: string;
	}>();

	let noteQuery = trpc().notes.note.createQuery(noteId);
</script>

<div style="position:absolute; background: white;" class="hover-note" use:action>
	<!-- {@const link = links.filter(Boolean).find((link) => link.id === currentId)} -->
	<!-- {@html idToHtmlMap.get(currentId)} -->

	<!-- {@render children()} -->

	{#if title}
		<h2>{title}</h2>
	{/if}

	{#if query.error($noteQuery)}
		<p>{$noteQuery.failureReason.message}</p>
	{:else if query.loading($noteQuery)}
		<p>Loading...</p>
	{:else if query.empty($noteQuery)}
		nothing found
	{:else if query.success($noteQuery)}
		<p>{@html $noteQuery.data.html}</p>
	{:else}
		<p>Something went wrong</p>
	{/if}

	{#if arrow}
		<div class="arrow" bind:this={$arrow}></div>
	{/if}
</div>

<style>
	.hover-note {
		pointer-events: none;
		background-color: #fff;
		border-radius: 8px;
		z-index: 50;
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		padding: 16px;
		height: calc(100vh - 64px);
		width: 500px;
		max-width: calc(100vw - 32px);
		max-height: 400px;
		overflow: hidden;
		border: 1px solid #f4f4f4;
	}

	h2 {
		margin: 0;
		font-size: 20px;
		letter-spacing: -0.01em;
	}
</style>
