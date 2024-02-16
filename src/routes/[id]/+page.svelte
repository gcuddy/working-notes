<script lang="ts">
	export let data;
</script>

<h1>
	{data.note?.title}
</h1>

<p>
	{data.note?.content}
</p>

<hr />

<h2>Backlinks</h2>

<ul>
	{#each data.incomingLinks as backlink}
		<li>
			{JSON.stringify(backlink)}
		</li>
	{/each}
</ul>
