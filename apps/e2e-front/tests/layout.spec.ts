import { test, expect } from '../fixtures/auth';

test.describe('Layout autenticado - Header y Sidebar', () => {
  test('Header muestra enlace Usuario y menú con Cerrar sesión', async ({ page, loggedInPage }) => {
    await page.goto('/es/home');
    await page.waitForLoadState('networkidle');
    const userTrigger = page.getByRole('link', { name: /usuario/i }).or(page.getByText(/usuario/i).first());
    await expect(userTrigger.first()).toBeVisible({ timeout: 10000 });
    await userTrigger.first().click();
    await expect(page.getByRole('link', { name: /cerrar sesión/i })).toBeVisible({ timeout: 5000 });
  });

  test('Sidebar muestra bloque de usuario y enlace de logout visibles', async ({ page, loggedInPage }) => {
    await page.goto('/es/home');
    await page.waitForLoadState('networkidle');
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible({ timeout: 10000 });
    const logoutLink = sidebar.getByRole('link', { name: /cerrar sesión|logout/i });
    await expect(logoutLink).toBeVisible({ timeout: 5000 });
  });
});
