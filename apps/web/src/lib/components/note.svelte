<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import HoverNote from '$lib/components/hover-note.svelte';
	import { useFloatingActions } from '$lib/floating-ui';
	import { type RouterOutputs } from '$lib/trpc';
	import { navigateStack } from '$lib/utils/stack';

	let { note } = $props<{
		note: RouterOutputs['notes']['note'];
	}>();

	$effect(() => {
		console.log({ note });
	});

	const [floatingRef, floatingContent] = useFloatingActions();

	let currentId = $state<string | null>(null);

	const idToTitleMap = new Map<string, string>();

	$effect(() => {
		for (const link of note.backlinks) {
			if (link.noteId && link.title) idToTitleMap.set(link.noteId, link.title);
		}

		for (const link of note.outgoingLinks) {
			if (link.noteId && link.target_text) idToTitleMap.set(link.noteId, link.target_text);
		}
	});

	const idToHtmlMap = new Map<string, string>();

	// let queries = $derived(
	// 	note.outgoingLinks.map((link) => trpc().notes.note.createQuery(link.noteId))
	// );
	/// what's difference between ^^ and usequeries?
	// answered: lots of things lol - one store, using context correctly

	// $effect(() => {
	// 	console.log('queries', queries);
	// });

	// const client = trpc();

	// const utils = client.createUtils();

	// const queries = createQueries({
	// 	queries: note.outgoingLinks.map((link) => {
	// 		return {
	// 			queryKey: client.notes.note.getQueryKey(link.noteId),
	// 			queryFn: utils.client.notes.note.query(link.noteId)
	// 		};
	// 	})
	// });
	// TODO: can't figure out createQueries - it seems to be broken!

	$effect(() => {
		console.log('outgoing', note.outgoingLinks);

		// const queries = trpc().createQueries((q) => {
		// 	console.log('creating queries');
		// 	console.log({ q });
		// 	const t = q.notes.note('123');
		// 	console.log({ t });
		// 	return [t];
		// });
	});

	$effect(() => {
		(async () => {
			// console.log('running data effect');
			// const outgoing = await data.outgoingLinksContent;
			// const incoming = await data.incomingLinksContent;
			// console.log({ outgoing, incoming });
			// for (const link of outgoing) {
			// 	if (!link) continue;
			// 	idToHtmlMap.set(link.id, link.html);
			// }
			// for (const link of incoming) {
			// 	if (!link) continue;
			// 	idToHtmlMap.set(link.source, link.html);
			// }
			// console.log('idToHtmlMap', idToHtmlMap);
		})();
	});

	async function handleClick(e: MouseEvent) {
		console.log('click');
		const href = (e.target as HTMLElement).closest('a')?.href;
		if (href) {
			if (e.metaKey) return;
			const url = new URL(href);
			if (url.toString().startsWith(window.location.origin)) {
				e.preventDefault();
				const currentStack = $page.data.stack;
				const id = url.pathname.slice(1);
				const newStack = navigateStack(currentStack, id);
				url.searchParams.set('stack', newStack.join(','));
				goto(url);
			}
		}
	}
</script>

{#if currentId}
	<HoverNote title={idToTitleMap.get(currentId)} action={floatingContent} noteId={currentId} />
{/if}

<!-- <svelte:document on:click={handleClick} /> -->

<div
	class="content"
	on:click={handleClick}
	on:mouseover={(e) => {
		if (e.target instanceof HTMLAnchorElement) {
			console.log(e.target.href);
			const url = new URL(e.target.href);
			if (url.toString().startsWith(window.location.origin)) {
				console.log('local link');
				currentId = url.pathname.slice(1);
				floatingRef(e.target);
				return;
			}
		}
		currentId = null;
	}}
>
	<h1>
		{note.title}
	</h1>
	{@html note.html}
</div>

<div class="backlinks" on:click={handleClick}>
	<h2>Backlinks</h2>
	<ul>
		{#each note.backlinks as backlink}
			<li>
				<a
					href="/{backlink.noteId}"
					on:mouseover={(e) => {
						if (e.currentTarget instanceof HTMLAnchorElement) {
							currentId = backlink.noteId;
							floatingRef(e.currentTarget);
						}
					}}
					on:mouseout={() => {
						currentId = null;
					}}
				>
					<span class="backlink-title">{backlink.title}</span>
					<div class="backlink-context">
						{@html backlink.target_text}
						<!-- {@html backlink.context} -->
					</div>
				</a>
			</li>
		{/each}
		<!-- {#await data.incomingLinks then incomingLinks}
			{#each incomingLinks as backlink}

			{/each}
		{/await} -->
	</ul>
</div>

<style>
	h1 {
		line-height: 1;
	}
	.backlinks {
		padding: 16px;
		background: #f4f4f4;
		margin: 0;
		max-width: 65ch;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.backlinks h2 {
		margin: 0;
		font-size: 20px;
		letter-spacing: -0.01em;
	}

	.backlinks li {
		height: auto;
		overflow: hidden;
		/* line clamp? */
		border-radius: 8px;
		user-select: none;
		padding: 8px;
		transition: background-color 0.2s;
		padding: 8px;
		border: 1px solid #ccc;
	}

	.backlinks li:hover {
		background-color: #f0f0f0;
	}
	.backlink-title {
		font-weight: 600;
		letter-spacing: -0.01em;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		color: #333;
	}

	.backlinks ul {
		padding: 0;
		list-style: none;
		margin: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	@media (max-width: 640px) {
		.backlinks ul {
			grid-template-columns: 1fr;
		}
	}

	.backlinks a {
		display: block;
		text-decoration: none;
	}

	.content {
		padding: 16px;
		max-width: 65ch;
		margin: 0 auto;
		line-height: 1.5;
	}

	.content :global(img) {
		display: block;
		max-width: 100%;
	}

	.backlink-context {
		pointer-events: none;
		color: #666;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;

		font-size: 14px;
	}

	.backlink-context :global(a) {
		color: inherit;
		text-decoration: none;
	}
</style>
