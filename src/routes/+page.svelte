<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<ul>
	{#each data.notes as note}
		<li>
			<a href="/{note.id}">
				{note.title}
			</a>
		</li>
	{/each}
</ul>
<form method="post" use:enhance>
	<input type="text" name="title" placeholder="Title" />

	<textarea name="content" placeholder="Content"></textarea>

	<button>Submit</button>
</form>
