// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aigralys.com',
  // Sitio estático. JS mínimo.
  compressHTML: true,
  // three.js va en un chunk aparte que solo se pide cerca del caso Bancor.
  vite: { build: { chunkSizeWarningLimit: 700 } },
  // Bilingüe: ES por defecto en `/`, EN en `/en/`.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
