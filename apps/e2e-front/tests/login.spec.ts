import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/login');
  });

  test('should display login form with email and password fields', async ({ page }) => {
    // Check for email input (placeholder: "Correo electrónico")
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();

    // Check for password input
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('should display login title', async ({ page }) => {
    // Title is "Iniciar sesión" from translations
    const heading = page.getByText('Iniciar sesión');
    await expect(heading.first()).toBeVisible();
  });

  test('should display forgot password link', async ({ page }) => {
    const forgotLink = page.getByText('Olvidé mi contraseña');
    await expect(forgotLink).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    // Click submit button (text: "Iniciar sesión")
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Should show "Este campo es requerido" error
    const errorMsg = page.getByText('Este campo es requerido');
    await expect(errorMsg.first()).toBeVisible();
  });
});
