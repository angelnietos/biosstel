import { test, expect } from '../fixtures/auth';

test.describe('Objetivos terminales / Resultados', () => {
  test('navigate to Objetivos terminales and see content', async ({ page, loggedInPage }) => {
    const link = page.getByRole('link', { name: /objetivos terminales|resultados/i }).first();
    await link.click();
    await page.waitForURL(/\/objetivos-terminales|\/resultados/);
    await expect(page).toHaveURL(/objetivos-terminales|resultados/);
    await expect(
      page.getByRole('heading', { name: /objetivos|resultados|terminal/i }).first()
    ).toBeVisible({ timeout: 8000 });
  });
});
