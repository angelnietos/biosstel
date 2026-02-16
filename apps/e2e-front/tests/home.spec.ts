import { test, expect } from '@playwright/test';

test.describe('Home / Root Page', () => {
  test('should redirect root to login', async ({ page }) => {
    await page.goto('/');
    // Root page redirects to /login, middleware adds locale → /es/login
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });

  test('should have Biosstel in the title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Biosstel/i);
  });
});
