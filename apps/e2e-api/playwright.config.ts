import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev:api',
    url: 'http://localhost:4000/api/health',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
