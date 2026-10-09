import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: 'https://cff187ef144e598ccec51a4942dcd79d@o4508116469219328.ingest.de.sentry.io/4512228558307408',
  enabled: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  release: import.meta.env.PUBLIC_SENTRY_RELEASE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
