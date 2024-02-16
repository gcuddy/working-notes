<script lang="ts">
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import { createFloatingActions } from 'svelte-floating-ui';
	import { onMount } from 'svelte';

	let { data } = $props();

	const [floatingRef, floatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'top',
		middleware: [offset(6), flip(), shift()]
	});

	let currentId = $state<string | null>(null);

	let outgoingLinksContent: Array<{ id: string; html: string }> = [];

	onMount(async () => {
		const res = await data.outgoingLinksContent;
		outgoingLinksContent = res;
	});
</script>

{#if currentId}
	<div style="position:absolute; background: white;" class="hover-note" use:floatingContent>
		{#await data.outgoingLinksContent then links}
			{@const link = links.filter(Boolean).find((link) => link.id === currentId)}
			{@html link?.html}
		{/await}
	</div>
{/if}

<div
	role="main"
	class="content"
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

<hr />

<h2>Backlinks</h2>

<div class="backlinks">
	<ul>
		{#await data.incomingLinks then incomingLinks}
			{#each incomingLinks as backlink}
				<!-- {JSON.stringify(backlink)} -->
				<li>
					<a href="/{backlink.source}">
						<span>{backlink.title}</span>
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
	}
	.backlinks {
		padding: 16px;
		background: #f4f4f4;
		margin: 0;
	}

	.backlinks ul {
		padding: 0;
		list-style: none;

		margin: 0;
	}

	.backlinks a {
		display: block;
		padding: 8px;
		border: 1px solid #ccc;
		margin: 8px 0;
		text-decoration: none;
	}

	.hover-note {
		pointer-events: none;
		background-color: #fff;
		border-radius: 8px;
		z-index: 50;
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		padding: 16px;
		max-width: 300px;
	}

	.content {
		padding: 16px;
		max-width: 65ch;
		margin: 0 auto;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		line-height: 1.5;
	}

	.content :global(img) {
		display: block;
		max-width: 100%;
	}

    .backlink-context {
        pointer-events: none;
    }
</style>
