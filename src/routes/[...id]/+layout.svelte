<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import HoverNote from '$lib/components/hover-note.svelte';
	import { useFloatingActions } from '$lib/floating-ui';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';

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
</script>

<div class="top">
	<a href="/about">Gus's notes</a>
	<button
		on:click={(e) => {
			// get id and title
			const { id, title } = $page.data.note;
			console.log({ id, title });
			const origin = window.location.origin;
			const url = new URL(window.location.href);
			url.searchParams.delete('stack');
			url.pathname = `/${id}/${slugify(title)}`;

			// copy to clipboard
			navigator.clipboard.writeText(`${origin}${url.pathname}`).then(() => {
                const b = e.target as HTMLButtonElement;
				b.textContent = 'Copied!';
				setTimeout(() => {
					b.textContent = 'Copy link';
				}, 1000);
				console.log('copied to clipboard');
			});
		}}
	>
		Copy link
	</button>
</div>
<div class="container" style:padding-top="44px">
	<!-- {#if $page.data.stackedNotes} -->
	<div class="sidebar">
		<span class="sidebar-title"> Trail </span>
		<ul>
			{#each $page.data.stackedNotes ?? [] as note (note.id)}
				<li transition:scale>
					<a
						on:focus
						on:blur
						on:click={(e) => {
                            if (e.metaKey) return;
                            e.preventDefault()
                            let stack = ($page.url.searchParams.get('stack')?.split(',') ?? []).filter(Boolean)
                            const id = $page.url.pathname.slice(1).split('/')[0];
                            console.log({ stack: [...stack], id });
                            if (stack.includes(id)) {
                                // stack.splice(stack.indexOf(id), 1)
                                // stack = stack.slice(0, stack.indexOf(id));
                            } else {
                                stack.push(id)
                            }

                            const url = new URL((e.target as HTMLAnchorElement).href);
                            url.searchParams.set('stack', stack.join(','));
                            console.log(`final stack`, {stack })
                            goto(url);
                        }}
						on:mouseout={(e) => {
							currentId = null;
						}}
						on:mouseover={(e) => {
							currentId = note.id;
                            ref(e.target as HTMLElement);
						}}
						class:active={$page.url.pathname.split('/').pop() === note.id}
						href="/{note.id}">{note.title}</a
					>
				</li>
			{/each}
		</ul>
		{#if currentId && $page.data.stackedNoteContent?.[currentId]}
			<HoverNote arrow={arrowEl} action={content}>
				{@html $page.data.stackedNoteContent[currentId]}
			</HoverNote>
		{/if}

		<!-- sidebar here -->
	</div>
	<!-- {/if} -->
	<div class="note">
		<slot />
	</div>
</div>

<style>
	.container {
		display: flex;
	}

	.sidebar {
		width: 200px;
		flex-shrink: 0;
		border-right: 1px solid #f4f4f4;
		position: fixed;
		top: 44px;
		left: 0;
		height: 100vh;
		/* background: #f4f4f4; */
	}

	@media (max-width: 800px) {
		.sidebar {
			display: none;
		}
	}

	.sidebar ul {
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 14px;
	}

	.sidebar-title {
		display: block;
		padding: 8px 16px;
		font-size: 14px;
		font-weight: 600;
		color: #666;
		border-bottom: 1px solid #f4f4f4;
	}

	.sidebar a {
		display: block;
		padding: 8px 16px;
		text-decoration: none;
		color: #333;
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
