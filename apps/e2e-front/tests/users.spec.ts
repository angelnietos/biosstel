import { test, expect } from '../fixtures/auth';

test.describe('Usuarios', () => {
  test('navega a Usuarios y ve listado', async ({ page, loggedInPage }) => {
    await page.getByRole('link', { name: /usuarios|usuario/i }).first().click();
    await page.waitForURL(/\/users/);
    await expect(page.getByText(/Usuario\/as|Usuarios/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('muestra botón Añadir Usuario', async ({ page, loggedInPage }) => {
    await page.goto('/es/users');
    await page.waitForLoadState('networkidle');
    const addUser = page.getByRole('link', { name: /añadir usuario/i });
    await expect(addUser.first()).toBeVisible({ timeout: 10000 });
  });

  test('clic Añadir Usuario navega a add-user', async ({ page, loggedInPage }) => {
    await page.goto('/es/users');
    await page.waitForLoadState('networkidle');
    const addBtn = page.getByRole('link', { name: /añadir usuario/i }).first();
    await addBtn.click();
    await page.waitForURL(/\/add-user/);
    expect(page.url()).toContain('add-user');
  });

  test('muestra filtros de usuarios', async ({ page, loggedInPage }) => {
    await page.goto('/es/users');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Usuario\/as|departamento|rol/i).first()).toBeVisible({ timeout: 8000 });
  });
});
