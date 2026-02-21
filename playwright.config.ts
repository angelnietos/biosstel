import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps',
  globalSetup: './playwright-global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 30000,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'e2e-api',
      testDir: './apps/e2e-api',
      use: {
        baseURL: process.env.API_URL || 'http://localhost:4000',
      },
    },
    {
      name: 'e2e-front',
      testDir: './apps/e2e-front',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.FRONT_URL || 'http://localhost:3000',
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev:api',
      url: 'http://localhost:4000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'pnpm dev:front',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});
