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
    // Source maps are uploaded by sentry-cli in CI; the Vite plugin upload doesn't work with Astro 6
    sentry({
      enabled: { client: true, server: false },
      telemetry: false,
      sourcemaps: { disable: true },
    }),
  ],
  vite: {
    environments: { client: { build: { sourcemap: 'hidden' } } },
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
