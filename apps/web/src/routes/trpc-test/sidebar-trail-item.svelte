<script lang="ts">
	import { trpc } from '$lib/trpc';
	import * as query from '$lib/utils/query';

	let { id } = $props<{ id: string }>();

	let queryData = trpc().notes.note.createQuery(id);
</script>

{#if query.error($queryData)}
	<p>{$queryData.failureReason.message}</p>
{:else if query.loading($queryData)}
	<div>...</div>
{:else if query.empty($queryData)}
	<!--  -->
{:else if query.success($queryData)}
	<div>
		{$queryData.data.title}
	</div>
{/if}
