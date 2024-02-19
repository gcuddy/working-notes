<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import HoverNote from '$lib/components/hover-note.svelte';
	import { useFloatingActions } from '$lib/floating-ui';
	import { trpc } from '$lib/trpc';
	import * as query from '$lib/utils/query';
	import { navigateStack } from '$lib/utils/stack';
	import { scale } from 'svelte/transition';

	type ViewType = 'list' | 'preview';

	let { id, viewType = 'list' } = $props<{ id: string; viewType?: ViewType }>();

	let queryData = trpc().notes.note.createQuery(id);

	let showHover = $state(false);

	const [ref, content] = useFloatingActions();
</script>

{#if showHover}
	<HoverNote action={content} noteId={id} />
{/if}

<li transition:scale class="note" data-view={viewType}>
	{#if query.error($queryData)}
		<p>{$queryData.failureReason.message}</p>
	{:else if query.loading($queryData)}
		<a href="/trpc-test/{id}">...</a>
	{:else if query.empty($queryData)}
		<!--  -->
	{:else if query.success($queryData)}
		<!-- svelte-ignore a11y-mouse-events-have-key-events-->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<a
			href="/trpc-test/{id}"
			use:ref
			class:active={$page.params.id === id}
			on:click={(e) => {
				if (e.metaKey) return;
				e.preventDefault();
				const currentStack = $page.data.stack;
				const newStack = navigateStack(currentStack, id);
				const url = new URL(e.currentTarget.href);

				url.searchParams.set('stack', newStack.join(','));
				goto(url);

				console.log({ newStack });
			}}
			on:mouseover={() => {
				showHover = true;
			}}
			on:mouseout={() => {
				showHover = false;
			}}
		>
			<!-- maybe a little preview? -->
			{#if viewType === 'preview'}
				<div class="preview">
					<div class="preview-inner">
						{@html $queryData.data.html}
					</div>
				</div>
			{/if}
			<span>{$queryData.data.title}</span>
		</a>
	{/if}
</li>

<style>
	.note[data-view='preview'] {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		align-items: center;
	}

	.note[data-view='list'] {
		padding: 0.5rem 1rem;
	}

	.note[data-view='list']:hover {
		background-color: #f0f0f0;
	}

	.preview {
		background-color: #f0f0f0;
		padding: 1rem;
		border-radius: 0.5rem;
		/* font-size: 0.75em; */
		overflow: hidden;
		pointer-events: none;
		width: 100px;
		aspect-ratio: 1 / 1;
	}

	.preview-inner :global(*) {
		/* transform: scale(0.5); */
		font-size: 0.6em !important;
		color: #333 !important;
	}

	a {
		text-decoration: none;
		color: #333;
	}

	.active {
		font-style: italic;
	}
</style>
