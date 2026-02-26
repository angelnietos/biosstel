import { test, expect } from '../fixtures/auth';

test.describe('Home - Filtros y acciones', () => {
  test('muestra barra de filtros "Filtrar por"', async ({ page, loggedInPage }) => {
    await expect(page.getByText('Filtrar por').first()).toBeVisible({ timeout: 8000 });
  });

  test('muestra Fichar entrada o Ver listado de fichajes', async ({ page, loggedInPage }) => {
    const ficharOrList = page.getByRole('link', { name: /fichar entrada|ver listado de fichajes/i });
    await expect(ficharOrList.first()).toBeVisible({ timeout: 8000 });
  });

  test('clic en Ver listado de fichajes navega a /fichajes', async ({ page, loggedInPage }) => {
    const link = page.getByRole('link', { name: /ver listado de fichajes/i }).first();
    await link.click();
    await page.waitForURL(/\/fichajes/);
    expect(page.url()).toMatch(/\/fichajes/);
  });

  test('puede cambiar filtro Marca (dropdown)', async ({ page, loggedInPage }) => {
    const filterLabel = page.getByText('Marca').first();
    await expect(filterLabel).toBeVisible({ timeout: 5000 });
    const dropdown = page.locator('[name="marca"]').first();
    if (await dropdown.isVisible()) {
      await dropdown.click();
    }
  });
});
