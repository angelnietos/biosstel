import { test as base } from '@playwright/test';

const ADMIN_EMAIL = 'admin@biosstel.com';
const ADMIN_PASSWORD = 'admin123';

export const test = base.extend<{ loggedInPage: void }>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/es/login');
    await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/home|\/es\/home/);
    await use();
  },
});

export { expect } from '@playwright/test';
