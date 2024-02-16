<script lang="ts">
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import { createFloatingActions } from 'svelte-floating-ui';

	let { data } = $props();

	const [floatingRef, floatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'top',
		middleware: [offset(6), flip(), shift()]
	});

	let currentId = $state<string | null>(null);
</script>

<h1>
	{data.note?.title}
</h1>

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
						<div>
							{@html backlink.html}
						</div>
					</a>
				</li>
			{/each}
		{/await}
	</ul>
</div>

<style>
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
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        padding: 16px;
        max-width: 300px;
    }
</style>
