import { test, expect } from '../fixtures/auth';

test.describe('Fichajes', () => {
  test('navigate to Fichajes and see main content', async ({ page, loggedInPage }) => {
    await page.getByRole('link', { name: /fichajes/i }).first().click();
    await page.waitForURL(/\/fichajes/);
    await expect(page).toHaveURL(/\/fichajes/);
    await expect(page.getByRole('heading', { name: /fichajes|control|jornada/i }).first()).toBeVisible({
      timeout: 8000,
    });
  });

  test('can open control de jornada or list', async ({ page, loggedInPage }) => {
    await page.getByRole('link', { name: /fichajes/i }).first().click();
    await page.waitForURL(/\/fichajes/);
    const controlOrList = page.getByRole('link', { name: /control|listado|jornada|entrada|salida/i }).first();
    await expect(controlOrList).toBeVisible({ timeout: 8000 });
  });
});
