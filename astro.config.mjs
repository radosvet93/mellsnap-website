// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://mellsnap.co.uk',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap(),
    sentry({
      org: 'radosvet',
      project: 'mellsnap-website',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      enabled: { client: true, server: false },
      telemetry: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.mellsnap.co.uk',
      },
    ],
  },
});
