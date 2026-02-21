import { test, expect } from '../fixtures/auth';

test.describe('Empresa', () => {
  test('navega a Departamentos por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/empresa/departamentos');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('heading', { name: /departamentos/i }).or(
        page.getByText(/departamentos/i).first()
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('navega a Centros de trabajo por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/empresa/centros-trabajo');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/centros de trabajo|Centros|añadir centro/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('página centros muestra Añadir centro', async ({ page, loggedInPage }) => {
    await page.goto('/es/empresa/centros-trabajo');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/añadir centro/i).first()).toBeVisible({ timeout: 8000 });
  });
});
