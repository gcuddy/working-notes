<script lang="ts">
	import { goto } from '$app/navigation';
	import HoverNote from '$lib/components/hover-note.svelte';
	import { trpc } from '$lib/trpc';
	import { createFloatingActions } from 'svelte-floating-ui';
	import { flip, offset, shift } from 'svelte-floating-ui/dom';

	let { data } = $props();

	const [floatingRef, floatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'top',
		middleware: [offset(6), flip(), shift()]
	});

	const noteData = trpc().notes.note.createQuery(data.note.id);

	$effect(() => {
		console.log({ $noteData });
	});

	let currentId = $state<string | null>(null);

	const idToHtmlMap = new Map<string, string>();

	$effect(() => {
		(async () => {
			console.log('running data effect');
			const outgoing = await data.outgoingLinksContent;
			const incoming = await data.incomingLinksContent;
			console.log({ outgoing, incoming });
			for (const link of outgoing) {
				if (!link) continue;
				idToHtmlMap.set(link.id, link.html);
			}

			for (const link of incoming) {
				if (!link) continue;
				idToHtmlMap.set(link.source, link.html);
			}

			// console.log('idToHtmlMap', idToHtmlMap);
		})();
	});

	async function handleClick(e: MouseEvent) {
		console.log({ e });
		const href = (e.target as HTMLElement).closest('a')?.href;
		if (href) {
			if (e.metaKey) return;
			e.preventDefault();

			const url = new URL(href);
			if (url.toString().startsWith(window.location.origin)) {
				const currentUrl = new URL(window.location.href);
				let stack = currentUrl.searchParams.has('stack')
					? currentUrl.searchParams.get('stack')!.split(',')
					: [];

				const id = currentUrl.pathname.slice(1).split('/')[0];
				if (stack.includes(id)) {
					// stack.splice(stack.indexOf(id), 1);
					// const index = stack.indexOf(id);
					// stack = stack.slice(0, index);
				} else {
					stack.push(id);
				}

				url.searchParams.set('stack', stack.join(','));

				goto(url);

				return;
			}
		}
	}
</script>

{#if currentId && idToHtmlMap.has(currentId)}
	<HoverNote action={floatingContent}>
		{@html idToHtmlMap.get(currentId)}
	</HoverNote>
{/if}

<div
	role="main"
	class="content"
	on:click={handleClick}
	on:focus
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
		{data.note?.title}
	</h1>
	{@html data.note?.html}
</div>

<div class="backlinks" on:click={handleClick}>
	<h2>Backlinks</h2>
	<ul>
		{#await data.incomingLinks then incomingLinks}
			{#each incomingLinks as backlink}
				<!-- {JSON.stringify(backlink)} -->
				<li>
					<a
						href="/{backlink.source}"
						on:mouseover={(e) => {
							if (e.currentTarget instanceof HTMLAnchorElement) {
								currentId = backlink.source;
								floatingRef(e.target);
							}
						}}
						on:mouseout={() => {
							currentId = null;
						}}
					>
						<span class="backlink-title">{backlink.title}</span>
						<div class="backlink-context">
							{@html backlink.html}
						</div>
					</a>
				</li>
			{/each}
		{/await}
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
