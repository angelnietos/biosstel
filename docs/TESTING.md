# Testing — Unitarios, cobertura y E2E

## Cómo ejecutar tests

| Comando | Descripción |
|---------|-------------|
| `pnpm test` | Todos los tests unitarios (Vitest) |
| `pnpm test:coverage` | Unitarios con cobertura (genera `coverage/`, incluye lcov para SonarCloud) |
| `pnpm test:watch` | Unitarios en modo watch |
| `pnpm test:api` | Solo tests en `apps/api-biosstel` |
| `pnpm test:front` | Solo tests en `apps/front-biosstel` |
| `pnpm test:e2e` | Tests E2E con Playwright (arranca API y Front si no están levantados) |
| `pnpm test:e2e:ui` | E2E con UI de Playwright |
| `pnpm playwright:install` | Instalar navegadores para E2E (solo la primera vez) |

## Reproducibilidad (local = CI)

- **Unitarios:** Mismo comando que en CI: `pnpm run test:coverage`. En CI se usa `CI=true`; el resultado no debe depender de eso para pasar/fallar.
- **E2E:** En CI el job levanta Postgres, hace `db:seed` y luego `pnpm run test:e2e`. Playwright usa `globalSetup` (`playwright-global-setup.ts`) para esperar a que la API responda en `/api/health`, y `webServer` para arrancar API y Front y esperar a sus URLs antes de ejecutar tests. En local, tener BD levantada (`pnpm db:start`) y datos (`pnpm db:seed`); luego `pnpm test:e2e` hace el resto.

## Cobertura

- Se genera en **`coverage/`**: `lcov.info` (SonarCloud), `coverage-summary.json`, HTML, etc.
- **Umbral:** No hay umbral mínimo configurado; la cobertura es **solo informativa** (el CI no falla por coverage bajo). Si en el futuro se quiere fallar el CI por cobertura baja, se puede añadir en `vitest.config.ts` algo como `coverage: { lines: 60, ... }`.
- CI sube el artefacto `coverage-report` para que el job de SonarCloud lo use.

## Timeouts y estabilidad

- **Vitest:** `testTimeout` y `hookTimeout` a 10s en la config raíz para evitar tests colgados.
- **Playwright:** timeout por test 30s; en CI hay 2 reintentos y 1 worker para reducir flakiness.
- Si un test falla de forma intermitente, revisar: orden de ejecución, timers (usar `vi.useFakeTimers()`), estado global o dependencias de red/mock.

## Qué cubren los tests

- **Unitarios:** Lógica de features (slices Redux, servicios, hooks), libs backend (use cases, repos donde existan tests).
- **E2E:** Proyectos en `apps/e2e-api` y `apps/e2e-front`; comprueban flujos contra API y frontend reales (con BD y servicios levantados).
