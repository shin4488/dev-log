import { defineConfig } from '@playwright/test';
import production from './playwright.config';

export default defineConfig({
  ...production,
  testMatch: 'dev.spec.ts',
  // The HMR test touches source mtimes; keep one owner of the dev server.
  workers: 1,
  use: { ...production.use, baseURL: 'http://127.0.0.1:8000/dev-log/' },
  webServer: {
    command: 'node scripts/dev.mjs',
    url: 'http://127.0.0.1:8000/dev-log/',
    reuseExistingServer: false,
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
  },
});
