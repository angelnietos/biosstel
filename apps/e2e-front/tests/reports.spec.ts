import { test, expect } from '../fixtures/auth';

test.describe('Informes', () => {
  test('navega a Reports por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/reports');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/informes|Informes|reports|resumen|métricas/i).first()).toBeVisible({ timeout: 10000 });
  });
});
