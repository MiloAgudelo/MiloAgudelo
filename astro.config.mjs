// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://miloagudelo.com',
  redirects: {
    '/': '/coming-soon',
    '/en': '/en/coming-soon',
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Satoshi',
      cssVariable: '--font-sans',
      options: {
        variants: [
          { src: ['./src/assets/fonts/Satoshi-Variable.woff2'], weight: '300 900', style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      options: {
        variants: [
          { src: ['./src/assets/fonts/JetBrainsMono-Regular.woff2'], weight: '400', style: 'normal' },
          { src: ['./src/assets/fonts/JetBrainsMono-Medium.woff2'], weight: '500', style: 'normal' },
        ],
      },
    },
  ],

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],
});
