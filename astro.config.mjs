// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aigralys.com',
  // Sitio estático, una sola página. JS mínimo.
  compressHTML: true,
});
