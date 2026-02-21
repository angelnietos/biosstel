import { test, expect } from '@playwright/test';

test.describe('Auth flow (login → home)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/login');
  });

  test('successful login redirects to home', async ({ page }) => {
    await page.locator('input[name="email"]').fill('admin@biosstel.com');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/home|\/es\/home/, { timeout: 10000 });
    expect(page.url()).toMatch(/\/home/);
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.locator('input[name="email"]').fill('admin@biosstel.com');
    await page.locator('input[name="password"]').fill('wrong');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/credenciales|error|inválid/i).first()).toBeVisible({
      timeout: 8000,
    });
  });
});
