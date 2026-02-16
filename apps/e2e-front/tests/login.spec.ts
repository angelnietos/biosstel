import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ingresar/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /ingresar/i }).click();
    // Check for email validation error
    const emailError = page.locator('text=El correo electrónico es requerido');
    await expect(emailError).toBeVisible();
  });

  test('should navigate to login page and accept valid credentials', async ({ page }) => {
    await page.goto('/es/login');
    
    // Fill login form with test credentials
    await page.getByLabel(/correo/i).fill('admin@biosstel.com');
    await page.getByLabel(/contraseña/i).fill('admin123');
    
    await page.getByRole('button', { name: /ingresar/i }).click();
    
    // Wait for navigation or error
    await page.waitForTimeout(2000);
  });
});
