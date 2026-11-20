// @ts-check
import { defineConfig } from 'astro/config';
export default defineConfig({ site: 'https://motionhotel.example', compressHTML: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'el', 'de', 'fr', 'it', 'ru', 'sv', 'no'],
    routing: { prefixDefaultLocale: false },
  },
});

