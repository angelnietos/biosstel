import { test, expect } from '../fixtures/auth';

test.describe('Operaciones', () => {
  test('navega a Operaciones por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/operaciones');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', { name: /operaciones/i }).or(
        page.getByText(/operaciones|comercial|telemarketing|backoffice|tienda/i).first()
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('muestra enlaces a subsecciones', async ({ page, loggedInPage }) => {
    await page.goto('/es/operaciones');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/comercial|telemarketing|backoffice|tienda|visitas|agenda|revisión|ventas/i).first()).toBeVisible({ timeout: 8000 });
  });
});
