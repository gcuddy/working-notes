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
	<div style="position:absolute; background: white;" use:floatingContent>
		{#await data.outgoingLinksContent then links}
			{@const link = links.filter(Boolean).find((link) => link.id === currentId)}
			{@html link?.html}
		{/await}
	</div>
{/if}

<div
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

<ul>
	{#each data.incomingLinks as backlink}
		<li>
			{JSON.stringify(backlink)}
		</li>
	{/each}
</ul>
