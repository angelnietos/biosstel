import { test, expect } from '../fixtures/auth';

test.describe('Inventario', () => {
  test('navega a Inventario por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/inventory');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/inventario|Inventario|stock|listado/i).first()).toBeVisible({ timeout: 10000 });
  });
});
