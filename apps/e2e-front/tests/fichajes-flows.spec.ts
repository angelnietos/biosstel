import { test, expect } from '../fixtures/auth';

test.describe('Fichajes - Navegación y pestañas', () => {
  test('desde home, enlace Fichar entrada lleva a control de jornada', async ({ page, loggedInPage }) => {
    const ficharBtn = page.getByRole('link', { name: /fichar entrada/i }).first();
    if (await ficharBtn.isVisible()) {
      await ficharBtn.click();
      await page.waitForURL(/\/fichajes\/control-jornada/);
      expect(page.url()).toMatch(/control-jornada/);
    } else {
      await page.getByRole('link', { name: /fichajes/i }).first().click();
      await page.waitForURL(/\/fichajes/);
      const controlLink = page.getByRole('link', { name: /control|jornada/i }).first();
      await expect(controlLink).toBeVisible({ timeout: 8000 });
    }
  });

  test('página Fichajes muestra pestañas o listado', async ({ page, loggedInPage }) => {
    await page.goto('/es/fichajes');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByRole('tab', { name: /fichajes|calendarios|horarios|permisos/i }).or(
        page.getByText(/listado|fichajes del día|calendarios laborales/i).first()
      )
    ).toBeVisible({ timeout: 10000 });
  });

  test('navegar a Control de jornada por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/fichajes/control-jornada');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/control|jornada|fichar|entrada|salida|pausar|tareas/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('navegar a Horarios por URL', async ({ page, loggedInPage }) => {
    await page.goto('/es/fichajes/horarios');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/horarios laborales|Horarios/i).first()).toBeVisible({ timeout: 10000 });
  });
});
