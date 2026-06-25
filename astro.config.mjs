import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Static output (SSG) → every page is real HTML at build time, which is what
// makes the site readable by Google, ChatGPT, and non-JS web scrapers. The
// React/Framer-Motion hero hydrates as an island on top of that HTML.
// (sitemap.xml is hand-authored in public/ — reliable for a small fixed set of
// pages and avoids the @astrojs/sitemap build-hook incompatibility.)
export default defineConfig({
  site: 'https://voxhelm.de',
  trailingSlash: 'ignore',
  integrations: [react(), tailwind()],
});
