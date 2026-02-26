# Scripts del monorepo

Referencia de todos los scripts definidos en `package.json`, agrupados por categoría. Ejecutar con: **`pnpm <script>`** (ej: `pnpm start`).

---

## Hook

| Script | Descripción |
|--------|-------------|
| **preinstall** | Se ejecuta antes de `pnpm install`; fuerza el uso de pnpm (no npm/yarn). |

---

## Desarrollo y arranque

| Script | Descripción |
|--------|-------------|
| **start** | Comprueba Docker y levanta el stack (`docker-compose.dev.yml`): Postgres, Adminer, API (4000), Frontend (3000). Live reload incluido. |
| **dev** | Alias de `start`. |
| **start:fresh** | Resetea la BD (`db:reset`) y luego levanta todo el stack (útil para empezar con BD limpia). |
| **start:local** | Arranca solo API + Frontend en local (Nx en paralelo). Requiere `pnpm db:start` antes. |
| **dev:local** | Alias de `start:local`. |
| **dev:api** | Solo API en desarrollo (puerto 4000, live reload). Requiere `pnpm db:start`. |
| **dev:front** | Solo Frontend en desarrollo (puerto 3000). |
| **start:api** | Levanta Postgres + API en Docker (sin frontend). Útil para desarrollar solo el front en local. |
| **dev:backend** | Igual que `start:api` pero incluye Adminer y muestra mensaje para ejecutar `pnpm dev:front` en otra terminal. |

---

## Build

| Script | Descripción |
|--------|-------------|
| **build** | Build de producción: API + Frontend. |
| **build:api** | Solo build de la API. |
| **build:front** | Solo build del Frontend. |
| **build:types** | Regenera `dist/` de `@biosstel/shared-types`. |
| **build:all** | Build de todos los proyectos del monorepo (Nx). |
| **verify** | Alias de `build:all`. |

---

## Limpieza e instalación

| Script | Descripción |
|--------|-------------|
| **clean** | Borra `node_modules`, `dist`, `.next` y cachés de Nx. No instala ni arranca. |
| **fresh-start** | `clean` → `pnpm install` → `start`. Arranque completo desde cero. |
| **ci** | `pnpm install --frozen-lockfile` (para pipelines CI). |

---

## Base de datos

| Script | Descripción |
|--------|-------------|
| **db:start** | Levanta Postgres + Adminer en Docker (puertos 5434, 8080). |
| **db:stop** | Detiene contenedores del compose de desarrollo (Postgres, Adminer, API, Front si estaban up). |
| **db:reset** | Borra volúmenes y vuelve a levantar solo Postgres + Adminer (BD vacía). |
| **db:seed** | Ejecuta el seed (script `docker/seed.sql` contra el contenedor). Requiere BD levantada. |
| **db:reset:seed** | Ejecuta `db:reset` y luego `db:seed`. Si el seed falla (BD aún arrancando), ejecutar `pnpm db:seed` de nuevo a los pocos segundos. |
| **api:seed** | Seed **vía API**: alimenta la base llamando a los endpoints REST (usuarios, departamentos, centros de trabajo, clientes, productos, inventario, calendarios, horarios, permisos, tareas, fichaje de ejemplo). Requiere API levantada y al menos el usuario admin (ej. tras `pnpm db:seed`). No requiere ejecutar SQL; útil para probar la API con datos. Objetivos del dashboard/terminales no tienen POST en la API — para esos usar `pnpm db:seed`. |
| **db:logs** | Logs en vivo del contenedor Postgres. |

---

## Docker (desarrollo)

| Script | Descripción |
|--------|-------------|
| **docker:dev:build** | Comprueba Docker y levanta el stack con `--build` (reconstruye imágenes). |
| **docker:dev:reset** | Para todo, borra volúmenes y levanta de nuevo con `--build`. |
| **docker:dev:down** | Alias de `db:stop`. Detiene los contenedores de desarrollo. |
| **docker:dev:full** | Stack de desarrollo + perfil monitoring (Grafana, Prometheus). |
| **restart** | Reinicia todos los servicios del compose de desarrollo. |
| **restart:api** | Reinicia solo el servicio API. |
| **restart:front** | Reinicia solo el servicio Frontend. |
| **logs** | Logs en vivo de todos los servicios. |
| **logs:api** | Logs solo del servicio API. |
| **logs:front** | Logs solo del servicio Frontend. |
| **cache:clear** | Limpia la caché de Next.js del contenedor frontend y reinicia el servicio. |
| **cache:clear:api** | Limpia `dist` del API en el contenedor y reinicia (si aplica). |

---

## Docker (producción)

| Script | Descripción |
|--------|-------------|
| **docker:prod** | Build e inicia servicios con `docker-compose.yml` en segundo plano. |
| **docker:prod:down** | Detiene contenedores de producción. |
| **docker:prod:logs** | Logs de contenedores de producción. |

---

## Monitoring

| Script | Descripción |
|--------|-------------|
| **monitoring:up** | Levanta Grafana (3002), Prometheus (9090), etc. en Docker. |
| **monitoring:down** | Detiene contenedores de monitoring. |

---

## Lint y formato

| Script | Descripción |
|--------|-------------|
| **lint** | ESLint en todos los proyectos (Nx). |
| **lint:fix** | ESLint con `--fix` en todos los proyectos. |
| **lint:api** | Solo lint de la API. |
| **lint:front** | Solo lint del Frontend. |
| **format** | Prettier: formatea todos los archivos. |
| **format:check** | Prettier: comprueba formato sin escribir. |

---

## Typecheck

| Script | Descripción |
|--------|-------------|
| **typecheck** | Type check en todos los proyectos (Nx). |
| **typecheck:api** | Solo type check de la API. |
| **typecheck:front** | Solo type check del Frontend. |

---

## Validación (pre-commit / CI)

| Script | Descripción |
|--------|-------------|
| **validate** | Ejecuta en orden: `lint` → `typecheck` → `test`. Útil antes de commit o en CI. |

---

## Tests unitarios (Vitest)

| Script | Descripción |
|--------|-------------|
| **test** | Ejecuta todos los tests unitarios (Vitest, un solo run). |
| **test:watch** | Vitest en modo watch (re-ejecuta al cambiar archivos). |
| **test:coverage** | Vitest con reporte de cobertura. |
| **test:ui** | Vitest con UI interactiva. |
| **test:api** | Solo tests de `apps/api-biosstel`. |
| **test:front** | Solo tests de `apps/front-biosstel`. |
| **test:libs** | Tests de las libs frontend (ui, ui-layout, platform, shared, auth, users, fichajes, operaciones, empresa, alertas, objetivos). |

---

## Tests E2E (Playwright)

| Script | Descripción |
|--------|-------------|
| **test:e2e** | Ejecuta tests E2E con Playwright. |
| **test:e2e:ui** | Playwright con UI interactiva. |
| **test:e2e:api** | E2E del API (si existe `apps/e2e-api`). |
| **test:e2e:front** | E2E del Frontend (si existe `apps/e2e-front`). |
| **test:e2e:all** | E2E de API + Frontend. |
| **playwright:install** | Instala navegadores de Playwright (p. ej. Chromium). |

---

## Storybook

| Script | Descripción |
|--------|-------------|
| **storybook** | Arranca Storybook en http://localhost:6006. |
| **storybook:fresh** | Storybook sin caché del manager (`--no-manager-cache`). |
| **build-storybook** | Build estático de Storybook. |
| **storybook:static** | Build estático y sirve con el script local. |
| **storybook:serve** | Sirve la carpeta `storybook-static` en el puerto 6006 (requiere haber ejecutado `build-storybook` antes). |

---

## Smoke test API

| Script | Descripción |
|--------|-------------|
| **api:smoke** | Llama a todos los endpoints GET (y login) de la API y muestra OK/FAIL. Requiere la API levantada (ej. `pnpm start` o `pnpm dev:api`). Env: `API_URL` (default http://localhost:4000), `API_SMOKE_USER`, `API_SMOKE_PASSWORD` (opcional). |
| **api:postman-test** | Script Node (no requiere Python) que prueba todos los endpoints como Postman: login, health, auth, users, clients, dashboard, empresa, work-centers, fichajes, tasks, productos, inventory, reports, alertas, operaciones, documentos. Al final lista los que no funcionan. Ejecutar con `--curl` para generar `scripts/api_postman_curls.sh`. Env: `API_URL`, `API_SMOKE_USER`, `API_SMOKE_PASSWORD`. |

---

## Nx

| Script | Descripción |
|--------|-------------|
| **nx** | Ejecuta la CLI de Nx (`pnpm nx run <proyecto>:<target>`, etc.). |
| **graph** | Abre el grafo de dependencias del monorepo (Nx Graph). |

---

**Nota:** Los comandos que usan Docker ejecutan `scripts/ensure-docker.js` cuando aplica para comprobar que Docker esté disponible.
