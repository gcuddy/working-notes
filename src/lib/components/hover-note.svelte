<script lang="ts">
	import type { Snippet } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	// export let action: (node: HTMLElement) => {};

	let {
		action,
		arrow,
		children
	} = $props<{
		action: (node: HTMLElement) => void;
		arrow?: Writable<HTMLElement | null>;
		children: Snippet;
	}>();
</script>

<div style="position:absolute; background: white;" class="hover-note" use:action>
	<!-- {@const link = links.filter(Boolean).find((link) => link.id === currentId)} -->
	<!-- {@html idToHtmlMap.get(currentId)} -->

	{@render children()}


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
		width: 500px;
		max-width: calc(100vw - 32px);
		max-height: 400px;
		overflow: hidden;
		border: 1px solid #f4f4f4;
	}
</style>
