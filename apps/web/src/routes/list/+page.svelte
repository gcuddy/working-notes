<script lang="ts">
	let { data } = $props();

	let listQuery = data.notes();
</script>

<ul>
	{#each $listQuery.data ?? [] as note}
		<li><a href="/{note.id}">{note.title}</a></li>
	{/each}
</ul>
