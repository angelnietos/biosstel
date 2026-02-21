import { test, expect } from '../fixtures/auth';

test.describe('Home (logged in)', () => {
  test('shows home content after login', async ({ page, loggedInPage }) => {
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 5000 });
  });

  test('has navigation to Fichajes', async ({ page, loggedInPage }) => {
    const fichajesLink = page.getByRole('link', { name: /fichajes/i }).first();
    await expect(fichajesLink).toBeVisible({ timeout: 5000 });
  });

  test('has navigation to Objetivos or Resultados', async ({ page, loggedInPage }) => {
    const objetivosLink = page.getByRole('link', { name: /objetivos|resultados/i }).first();
    await expect(objetivosLink).toBeVisible({ timeout: 5000 });
  });
});
