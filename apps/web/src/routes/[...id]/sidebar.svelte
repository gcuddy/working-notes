<script lang="ts">
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import SidebarTrailItem from './sidebar-trail-item.svelte';
</script>

<div class="sidebar">
	<div class="sidebar-header">
		<span class="sidebar-title"> Trail </span>
		<!-- <div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="#000000"
				viewBox="0 0 256 256"
				><path
					d="M90,64a6,6,0,0,1,6-6H216a6,6,0,0,1,0,12H96A6,6,0,0,1,90,64Zm126,58H96a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Zm0,64H96a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12ZM56,58H40a6,6,0,0,0,0,12H56a6,6,0,0,0,0-12Zm0,64H40a6,6,0,0,0,0,12H56a6,6,0,0,0,0-12Zm0,64H40a6,6,0,0,0,0,12H56a6,6,0,0,0,0-12Z"
				></path></svg
			>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="#000000"
				viewBox="0 0 256 256"
				><path
					d="M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34Zm2,174a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Z"
				></path></svg
			>
		</div> -->
	</div>
	<ul class="sidebar-list">
		{#each $page.data.stack ?? [] as id}
			<SidebarTrailItem {id} />
		{/each}
	</ul>
	<!-- {#if currentId && $page.data.stackedNoteContent?.[currentId]}
		<HoverNote arrow={arrowEl} action={content}>
			{@html $page.data.stackedNoteContent[currentId]}
		</HoverNote>
	{/if} -->
</div>

<style>
	.sidebar-header {
		display: flex;
		justify-content: space-between;
		padding: 8px 16px;
		font-size: 14px;
		font-weight: 600;
		color: #666;
		border-bottom: 1px solid #f4f4f4;
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
		padding: 16px 0;
		margin: 0;
		font-size: 14px;

		display: flex;
		flex-direction: column;
		/* align-items: center; */
		/* gap: 1rem; */
	}

	.sidebar-title {
	}
</style>
