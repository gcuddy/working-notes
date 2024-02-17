import { AUTH_KEY } from '$env/static/private';
import { insertBacklinkSchema } from '$lib/db/schema';

export const PUT = async ({ locals, request, params, platform }) => {
	const auth = request.headers.get('Authorization');
	if (auth !== AUTH_KEY) {
		return new Response('Unauthorized', { status: 401 });
	}
	try {
		const data = await request.json();
		const parsed = insertBacklinkSchema.parse(data);
		await platform?.env.DB.prepare(
			'INSERT OR IGNORE INTO backlinks (target, source, context, target_text) VALUES (?1, ?2, ?3, ?4)'
		)
			.bind(parsed.target, parsed.source, parsed.context, parsed.target_text)
			.run();
		// await locals.db
		// 	.insert(backlinks)
		// 	.values({
		// 		// context: parsed.context,
		// 		target: parsed.target,
		// 		source: parsed.source
		// 		// target_text: parsed.target_text
		// 	})
		// 	.onConflictDoNothing();
		return new Response('OK');
	} catch (e) {
		console.error(e);
		return new Response('Error', { status: 500 });
	}
};
