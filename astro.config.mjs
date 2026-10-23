// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aigralys.com',
  // Sitio estático. JS mínimo.
  compressHTML: true,
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
