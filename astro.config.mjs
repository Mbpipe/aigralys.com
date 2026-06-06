// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aigralys.com',
  // Sitio estático. JS mínimo.
  compressHTML: true,
  // Bilingüe: EN por defecto en `/`, ES en `/es`.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
