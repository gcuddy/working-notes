import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./src/lib/db/schema.ts'],
	driver: 'd1',
	dbCredentials: {
		dbName: 'notes',
		wranglerConfigPath: 'wrangler.toml'
	},
	out: './migrations',
	strict: true,
	verbose: true
});
