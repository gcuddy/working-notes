import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter, RouterOutputs } from '@gus/api/src/router';
import SuperJSON from 'superjson';
import type { QueryClient } from '@tanstack/svelte-query';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import { PUBLIC_API_URL } from '$env/static/public';
import { dev } from '$app/environment';

const createClient = (fetch?: typeof window.fetch) =>
	createTRPCProxyClient<AppRouter>({
		links: [
			httpBatchLink({
				url: `${PUBLIC_API_URL}/trpc`,
				fetch
			}),
			loggerLink({
				enabled: (opts) => dev
			})
		],
		transformer: SuperJSON
	});

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

export function trpc(opts?: { queryClient?: QueryClient; fetch?: typeof window.fetch }) {
	if (opts?.fetch) {
		return svelteQueryWrapper<AppRouter>({
			client: createClient(opts.fetch),
			queryClient: opts.queryClient
		});
	}
	return svelteQueryWrapper<AppRouter>({
		client,
		queryClient: opts?.queryClient
	});
}

export type { RouterOutputs };
