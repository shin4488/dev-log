import { defineConfig } from '@playwright/test';
import production from './playwright.config';

export default defineConfig({
  ...production,
  testMatch: 'dev.spec.ts',
  // The HMR test updates the timestamps of source files. Run one test at a time so the hot updates it triggers cannot reload pages that other tests are checking.
  workers: 1,
  use: { ...production.use, baseURL: 'http://127.0.0.1:8000/dev-log/' },
  webServer: {
    command: 'node scripts/dev.mjs',
    url: 'http://127.0.0.1:8000/dev-log/',
    reuseExistingServer: false,
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
  },
});
