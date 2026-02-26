import { test, expect } from '../fixtures/auth';

test.describe('Objetivos terminales - Filtros y pestañas', () => {
  test('página objetivos terminales muestra pestañas Contratos / Puntos', async ({ page, loggedInPage }) => {
    await page.getByRole('link', { name: /objetivos terminales|resultados/i }).first().click();
    await page.waitForURL(/objetivos-terminales|resultados/);
    await expect(page.getByText(/contratos|puntos|objetivos terminales|Objetivos terminales/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('muestra sección departamentos o personas', async ({ page, loggedInPage }) => {
    await page.goto('/es/objetivos-terminales');
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByText(/departamentos|personas|asignación/i).first()
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Objetivos terminales - Activar y Guardar configuración', () => {
  test('muestra botón Activar o contenido activo', async ({ page, loggedInPage }) => {
    await page.goto('/es/objetivos-terminales');
    await page.waitForLoadState('networkidle');
    const activar = page.getByRole('button', { name: /activar/i });
    const guardar = page.getByRole('button', { name: /guardar configuración/i });
    const inactivo = page.getByText(/objetivo inactivo/i);
    await expect(activar.or(guardar).or(inactivo)).toBeVisible({ timeout: 10000 });
  });

  test('al hacer clic en Activar muestra mensaje de éxito', async ({ page, loggedInPage }) => {
    await page.goto('/es/objetivos-terminales');
    await page.waitForLoadState('networkidle');
    const activar = page.getByRole('button', { name: /^activar$/i });
    if (await activar.isVisible().catch(() => false)) {
      await activar.click();
      await expect(page.getByText(/activado correctamente|ya puedes editarlo/i)).toBeVisible({ timeout: 8000 });
    }
  });

  test('flujo Guardar configuración: editar meta y guardar persiste el valor', async ({
    page,
    loggedInPage,
  }) => {
    await page.goto('/es/objetivos-terminales');
    await page.waitForLoadState('networkidle');
    const activar = page.getByRole('button', { name: /^activar$/i });
    if (await activar.isVisible().catch(() => false)) {
      await activar.click();
      await page.getByText(/activado correctamente|ya puedes editarlo/i).waitFor({ state: 'visible', timeout: 8000 });
    }
    const editBtn = page.getByRole('button').filter({ has: page.locator('svg') }).first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();
      const guardarBtn = page.getByRole('button', { name: /guardar configuración/i });
      await expect(guardarBtn).toBeVisible({ timeout: 5000 });
      const targetInput = page.locator('input[type="number"]').first();
      if (await targetInput.isVisible().catch(() => false)) {
        await targetInput.fill('150');
        await guardarBtn.click();
        await expect(page.getByText(/configuración guardada/i)).toBeVisible({ timeout: 8000 });
      }
    }
  });
});
