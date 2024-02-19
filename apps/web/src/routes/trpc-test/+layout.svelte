<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import HoverNote from '$lib/components/hover-note.svelte';
	import { useFloatingActions } from '$lib/floating-ui';
	import { writable } from 'svelte/store';
	import Sidebar from './sidebar.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { trpc } from '$lib/trpc';

	$effect(() => {
		console.log({ $page });
	});

	let currentId = $state<string | null>(null);

	const arrowEl = writable<HTMLElement | null>(null);
	const [ref, content] = useFloatingActions({
		arrowEl
	});

	function slugify(text: string) {
		return text
			.toString()
			.normalize('NFD') // split an accented letter in the base letter and the acent
			.replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
			.replace(/\s+/g, '-'); // separator
	}

	beforeNavigate(() => {
		// make sure to reset the currentId when navigating away
		currentId = null;
	});

	const queryClient = useQueryClient();

	const utils = trpc().createUtils();

	let button: HTMLButtonElement | null = $state(null);

	async function handleCopy() {
		const id = $page.params.id;

		if (!id) return;

		const note = await utils.notes.note.ensureData(id);
		const { title } = note;

		const origin = $page.url.origin;
		const url = new URL($page.url);

		url.searchParams.delete('stack');
		url.pathname = `/${id}/${title ? slugify(title) : ''}`;

		navigator.clipboard.writeText(`${origin}${url.pathname}`).then(() => {
			if (!button) return;
			button.textContent = 'Copied!';
			setTimeout(() => {
				if (!button) return;
				button.textContent = 'Copy link';
			}, 1000);
			console.log('copied to clipboard');
		});
	}
</script>

<div class="top">
	<a href="/about">Gus's notes</a>
	<button on:click={handleCopy} bind:this={button}> Copy link </button>
</div>
<div class="container" style:padding-top="44px">
	<Sidebar />
	<div class="note">
		<slot />
	</div>
</div>

<style>
	.container {
		display: flex;
	}

	.top {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		border-bottom: 1px solid #f4f4f4;
		padding: 0 16px;
	}

	.top button {
		background: none;
		border: 1px solid #f4f4f4;
		padding: 8px 16px;
		font-weight: 500;
		border-radius: 4px;
		color: #333;
		cursor: pointer;
	}

	.top button:hover {
		background: #f4f4f4;
	}

	.top a {
		text-decoration: none;
		color: #333;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.note {
		padding-left: 212px;
	}

	@media (max-width: 800px) {
		.note {
			padding-left: 0;
		}
	}

	.active {
		font-weight: 600;
	}
</style>
