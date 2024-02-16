import type { Handle } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';

export const handle: Handle = async ({ event, resolve }) => {
	// inject d1

	if (event.platform?.env.DB) {
		const db = drizzle(event.platform.env.DB);
		event.locals.db = db;
	}

	return await resolve(event);
};
