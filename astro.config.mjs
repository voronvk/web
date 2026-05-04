// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

/** Vercel: serverless + prerendered pages. Use @astrojs/node if you self-host on a Node server instead. */
export default defineConfig({
	adapter: vercel(),
	vite: {
		plugins: [tailwindcss()],
	},
});
