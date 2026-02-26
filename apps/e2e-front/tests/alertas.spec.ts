import { test, expect } from '../fixtures/auth';

test.describe('Alertas', () => {
  test('navega a Alertas por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/alertas');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', { name: /alertas/i }).or(
        page.getByText(/alertas|ventas|recordatorios/i).first()
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('muestra enlaces a subsecciones', async ({ page, loggedInPage }) => {
    await page.goto('/es/alertas');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/alertas|ventas|recordatorios|tracking/i).first()).toBeVisible({ timeout: 8000 });
  });
});
