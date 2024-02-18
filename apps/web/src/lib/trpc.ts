import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@gus/api/src/router';
import SuperJSON from 'superjson';
import type { QueryClient } from '@tanstack/svelte-query';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import { PUBLIC_API_URL } from '$env/static/public';
import { dev } from '$app/environment';

const client = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${PUBLIC_API_URL}/trpc`
		}),
		loggerLink({
			enabled: (opts) => dev
		})
	],
	transformer: SuperJSON
});

export function trpc(queryClient?: QueryClient) {
	return svelteQueryWrapper<AppRouter>({
		client,
		queryClient
	});
}

// let browserClient: ReturnType<typeof svelteQueryWrapper<AppRouter>>; // TODO: ssr by passing in fetch function from sveltekit (see trpc-sveltekit code) export function trpc(queryClient?: QueryClient) { const isBrowser = typeof window !== 'undefined'; if (isBrowser && browserClient) return browserClient; const _client = svelteQueryWrapper<AppRouter>({ client, queryClient }); if (isBrowser) browserClient = _client; return client; }
