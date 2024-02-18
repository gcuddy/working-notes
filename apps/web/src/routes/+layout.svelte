<script lang="ts">
	import './app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	export let data;
</script>

<QueryClientProvider client={data.queryClient}>
	<slot />
</QueryClientProvider>
