// See https://kit.svelte.dev/docs/types#app

import type { DrizzleD1Database } from 'drizzle-orm/d1';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: DrizzleD1Database;
		}
		interface PageData {
			stackedNotes?: { id: string; title: string }[];
			// this should probably be a map
			// noteMap?: Record<string, { id: string; title: string; html: string }>;
			// map id -> html
			stackedNoteContent?: Record<string, string>;
		}
		interface PageState {
			// eventually this...
			// tree?: import('$lib/types.js').TreeNode<import('$lib/types.js').Note>;
			stack?: import('$lib/types.js').Note[];
		}
		interface Platform {
			env: {
				BUCKET: R2Bucket;
				DB: D1Database;
				context: {
					waitUntil(promise: Promise<any>): void;
				};
				caches: Cache;
			};
		}
	}
}

export {};
