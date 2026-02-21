import { test, expect } from '../fixtures/auth';

test.describe('Productos', () => {
  test('navega a Productos y ve contenido', async ({ page, loggedInPage }) => {
    await page.getByRole('link', { name: /productos/i }).first().click();
    await page.waitForURL(/\/productos/);
    await expect(page.getByText(/productos|Productos|inventario/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('enlace a Inventario o listado visible', async ({ page, loggedInPage }) => {
    await page.goto('/es/productos');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('link', { name: /inventario/i }).or(
        page.getByText(/productos|listado|nuevo/i).first()
      )
    ).toBeVisible({ timeout: 8000 });
  });

  test('navegar a producto nuevo por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/productos/nuevo');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/nuevo producto|Producto|nombre|código/i).first()).toBeVisible({ timeout: 10000 });
  });
});
