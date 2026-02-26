/**
 * Global setup para E2E: espera a que la API esté lista (health) antes de ejecutar tests.
 * Útil cuando los servidores se arrancan fuera de Playwright (p. ej. CI con db:seed previo).
 * Playwright también usa webServer con url a /api/health para arrancar y esperar en local.
 */
async function globalSetup() {
  const base = process.env.API_URL || 'http://localhost:4000';
  const healthUrl = `${base}/api/health`;
  const maxAttempts = 30;
  const delayMs = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const r = await fetch(healthUrl);
      if (r.ok) return;
    } catch {
      // Servidor aún no listo
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`API not ready for E2E after ${maxAttempts} attempts: ${healthUrl}`);
}

export default globalSetup;
