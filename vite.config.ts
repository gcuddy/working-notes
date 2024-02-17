import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: ['valibot', 'drizzle-valibot']
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
