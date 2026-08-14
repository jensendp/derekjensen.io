// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://derekjensen.io',
  // edgeMiddleware: true deploys src/middleware.ts as real Vercel Edge Middleware,
  // so it runs in front of every request — including prerendered static pages like
  // the /audits/ pages, not just on-demand (SSR) routes.
  adapter: vercel({ edgeMiddleware: true }),

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