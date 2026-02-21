# Tests en features de frontend

Plan para añadir tests **unitarios** e **integración** a cada feature del front, de 1 en 1.

## Convenciones

- **Vitest** + **happy-dom** para unit e integración en libs.
- Nomenclatura: `*.test.ts` / `*.test.tsx` (incluidos por `vitest.config.ts` de cada lib).
- Unit: lógica pura (slice reducers, handlers de async thunk, servicios con `fetch` mockeado).
- Integración: componente + Provider (Redux, etc.) y comprobación de estado/UI.

## Scripts de test en package.json

| Script | Descripción |
|--------|-------------|
| `pnpm test` | Vitest run (todos los tests del monorepo según vitest.config raíz) |
| `pnpm test:watch` | Vitest en modo watch |
| `pnpm test:coverage` | Vitest con cobertura |
| `pnpm test:vitest:ui` | Vitest en modo UI (interfaz en navegador) |
| `pnpm test:all` | Nx: ejecuta el target `test` en **todos** los proyectos que lo tengan |
| `pnpm test:libs` | Nx: tests de libs front (ui, ui-layout, platform, shared, auth, users, fichajes, operaciones, empresa, alertas, objetivos, productos, inventory, reports) |
| `pnpm test:auth` | Tests del feature auth |
| `pnpm test:fichajes` | Tests del feature fichajes |
| `pnpm test:objetivos` | Tests del feature objetivos |
| `pnpm test:alertas` | Tests del feature alertas |
| `pnpm test:empresa` | Tests del feature empresa |
| `pnpm test:usuarios` | Tests del feature users |
| `pnpm test:operaciones` | Tests del feature operaciones |
| `pnpm test:productos` | Tests del feature productos |
| `pnpm test:inventory` | Tests del feature inventory |
| `pnpm test:reports` | Tests del feature reports |
| `pnpm test:ui` | Tests de la lib ui |
| `pnpm test:ui-layout` | Tests de la lib ui-layout |
| `pnpm test:platform` | Tests de la lib platform |
| `pnpm test:shared` | Tests de la lib @biosstel/shared |
| `pnpm test:api` | Vitest solo apps/api-biosstel |
| `pnpm test:front` | Vitest solo apps/front-biosstel |
| `pnpm test:e2e` | Playwright (todos los E2E) |
| `pnpm test:e2e:api` | Playwright E2E API |
| `pnpm test:e2e:front` | Playwright E2E front |
| `pnpm test:e2e:all` | Playwright E2E api + front |

```bash
# Un solo feature (ej. auth)
pnpm test:auth

# Varios features a mano
pnpm exec nx run-many -t test -p auth,fichajes,objetivos

# Todos los libs de front
pnpm test:libs

# Todo lo que tenga target test en el monorepo
pnpm test:all
```

## Estado por feature

| Feature    | Unit tests                          | Integración              |
|-----------|--------------------------------------|---------------------------|
| **auth**  | ✅ authSlice, auth service (fetch mock) | ✅ Store + componente con useSelector |
| **fichajes** | ✅ fichajesSlice, fichajesService | Pendiente |
| **objetivos** | ✅ dashboard service | Pendiente |
| **alertas** | ✅ alertasSlice, alertas service (getAlertas) | Pendiente |
| **empresa** | ✅ empresaSlice, empresa service (getEmpresa, createDepartment, createWorkCenter) | Pendiente |
| **usuarios** | ✅ userSlice, users service (getUsers, createUser) | Pendiente |
| **productos** | ✅ productos service (getProductos, getProductoById, create, update, delete) | Pendiente |
| **operaciones** | ✅ operacionesSlice, operaciones service (getOperaciones) | Pendiente |
| **reports** | ✅ reports service (getReportsSummary) | Pendiente |
| **inventory** | ✅ inventory service (getInventory, getById, create, update, delete) | Pendiente |

## Patrón para añadir tests a un feature nuevo

1. **Slice (si existe)**  
   - `src/data-access/store/<nombre>Slice.test.ts`  
   - Probar: estado inicial, `reducer(estado, action.fulfilled(payload))` y `action.rejected`, reducers síncronos (clearError, etc.).

2. **Servicios (llamadas HTTP)**  
   - `src/services/<nombre>.test.ts`  
   - `beforeEach`: `vi.stubGlobal('fetch', vi.fn())`.  
   - Por cada método: mock de `fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(...) })`, assert de URL (e.g. `expect.stringContaining('/path')`) y body si aplica.

3. **Integración**  
   - `src/integration/<feature>.integration.test.tsx` (o junto a componentes).  
   - `configureStore` con el reducer del feature, `Provider`, componente que use `useSelector`/dispatch, `render` + `screen.getByTestId` / `getByRole` y comprobar que el estado se refleja en la UI.

## E2E

Los E2E (Playwright) están en `apps/e2e-front/` y `apps/e2e-api/`. No sustituyen los unit/integración de cada feature; los complementan.
