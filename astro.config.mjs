// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://derekjensen.io',
  // NOT edgeMiddleware: true — every /audits/ page already sets prerender = false,
  // so those requests are already on-demand routes served by the regular _render
  // function, where the bundled middleware already applies. Turning on Vercel Edge
  // Middleware mode was redundant and broke POST-body handling for other on-demand
  // routes (e.g. /api/subscribe) site-wide — reverted.
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/tools/prompt-builder') &&
        !page.includes('/blog/tag/') &&
        !page.includes('/audits/'),
    }),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});