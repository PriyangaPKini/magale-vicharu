// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://magale-vicharu.netlify.app',
  output: 'static',
  integrations: [sitemap()],
});
