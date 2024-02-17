import type { Handle } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';

export const handle: Handle = async ({ event, resolve }) => {
	// inject d1

	if (event.platform?.env.DB) {
		console.log('event.platform.env', event.platform.env);
		const db = drizzle(event.platform.env.DB, {
			logger: true
		});
		event.locals.db = db;
	}

	return await resolve(event);
};
