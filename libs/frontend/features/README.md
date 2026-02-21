# Features Frontend — Estructura estándar

Todas las features en `libs/frontend/features/*` siguen la **misma estructura de carpetas y convenciones**. Dependen solo de `@biosstel/ui`, `@biosstel/ui-layout`, `@biosstel/platform`, `@biosstel/shared` y `@biosstel/shared-types`. No dependen de otras features (salvo excepciones documentadas en [FRONTEND_BOUNDARIES.md](../../plans/FRONTEND_BOUNDARIES.md)).

---

## Estructura de carpetas obligatoria

**Solo estas carpetas** a nivel de `src/`. No crear `constants/`, `utils/`, `components/` ni `layouts/` en la raíz de `src`; lo que corresponda va dentro de `api/`, `data-access/` o `pages/`.

```
libs/frontend/features/{feature}/src/
├── api/                # Todo lo relacionado con la API (clientes HTTP + tipos públicos)
│   ├── services/       # Llamadas HTTP al backend
│   │   ├── models/     # Tipos de contrato API (request/response, DTOs); index.ts re-exporta
│   │   │   └── index.ts
│   │   └── index.ts
│   └── types/          # Re-export de tipos para el barrel público de la feature (index.ts)
│       └── index.ts
├── data-access/        # Estado y orquestación (Redux, hooks)
│   ├── models/         # Tipos de estado/dominio y constantes (state, payloads, filtros, etc.); index.ts re-exporta
│   │   └── index.ts
│   ├── store/          # Opcional: Redux slice(s)
│   └── index.ts
├── pages/              # Pantallas y componentes de pantalla
│   ├── components/     # Componentes por página (formularios, listas, modales, dashboards)
│   │   └── index.ts
│   ├── layouts/        # Layouts de la feature (opcional)
│   │   └── index.ts
│   └── index.ts
├── shell/              # Composición de alto nivel (conecta datos + UI; opcional)
│   └── index.ts
├── integration/        # Tests de integración (*.integration.test.ts(x)); no se exporta en el barrel público
│   └── index.ts
├── app/                # Opcional: solo si la feature aporta componentes de alcance app (logout, etc.)
│   └── index.ts
└── index.ts            # Exports públicos de la feature
```

---

## Reglas

| Elemento | Regla |
|----------|--------|
| **Nombre de la lib** | `{feature}` en minúsculas (auth, usuarios, objetivos, fichajes, alertas, operaciones, empresa, productos, inventory, reports). |
| **api/** | Carpeta que agrupa **api/services** (clientes HTTP y **api/services/models** con tipos de contrato) y **api/types** (barrel de tipos para el API público de la feature). |
| **api/services/** | Llamadas HTTP al backend. Los tipos de contrato API van en **api/services/models/** (re-export desde `@biosstel/shared-types` o interfaces propias). |
| **api/types/** | Un único `index.ts` que re-exporta desde `api/services/models` (y si aplica desde `data-access/models`) para que el barrel de la feature exponga tipos. |
| **data-access/** | Hooks y/o Redux slices. Los **tipos de estado/dominio** y constantes (state, payloads, filtros, colores, etc.) van en **data-access/models/** (p. ej. `data-access/models/index.ts` o varios ficheros dentro de `models/`). |
| **pages/** | Componentes React por pantalla. Subcarpeta `components/` por página o agrupados; `layouts/` si la feature define layouts propios. Siempre `pages/index.ts` que exporte los componentes de página. |
| **shell/** | Componente(s) que componen layout + contenido. Opcional; si la feature se usa como una sola página, el shell puede ser un wrapper simple o re-exportar la página principal. |
| **integration/** | Tests de integración (store + servicios + componentes). Incluir `index.ts`; no se re-exporta en el barrel público de la feature. |
| **app/** | Opcional. Componentes de alcance app (p. ej. LogoutPage, ApiErrorHandler). Solo si la feature aporta algo usado a nivel de aplicación. |

---

## Dónde van los tipos (models vs contrato API)

Lo habitual es **no** tener una carpeta `types/` con toda la tipificación, sino colocar los tipos donde se usan:

| Uso del tipo | Dónde definirlo / re-exportarlo | Ejemplos |
|--------------|---------------------------------|----------|
| **Contrato API** (request/response, DTOs) | **services/models/** — `services/models/index.ts` re-exporta desde `@biosstel/shared-types` o define interfaces. El servicio importa desde `./models`. | `LoginCredentials`, `AuthResponse`, `User`, `ProductListResponse`, `Fichaje` |
| **Estado / dominio** (Redux state, constantes, helpers) | **data-access/models/** — `data-access/models/index.ts` (y opcionalmente más ficheros: filterOptions, objectiveColors, etc.). El slice y las páginas importan desde `../models` o `../../../data-access/models`. | `FichajesState`, filtros, colores, formateo de fechas |
| **Barrel público de la feature** | **types/** — opcional; `types/index.ts` re-exporta desde `../services/models` y `../data-access/models` para que quien importe `@biosstel/objetivos` tenga tipos en un solo sitio. | Re-export de tipos y constantes |

- **Páginas**: importar desde `../services/models`, `../data-access/models` o `@biosstel/shared-types`.
- Toda la tipificación y constantes de dominio quedan **contenidas** en `services/models/` y `data-access/models/`; no ficheros sueltos `types.ts` en la raíz de services o data-access.

---

## Contenido de `index.ts` (raíz de la feature)

Todas las features exportan de forma homogénea:

```typescript
/**
 * @biosstel/{feature} - Descripción breve.
 * Estructura: types, services, data-access, pages, shell (y opcional app).
 */
export * from './api/types';
export * from './api/services';
export * from './data-access';
export * from './shell';
export * from './pages';
// export * from './app';  // Solo si existe
```

Si una feature no tiene Redux ni hooks complejos (solo servicios + páginas), debe tener igualmente las carpetas `types` (o re-export de tipos desde services), `data-access` y `shell` con un contenido mínimo para mantener la misma estructura.

---

## Naming consistente

- **services:** Fichero principal `{feature}.ts` (ej. `auth.ts`, `productos.ts`, `inventory.ts`) y barrel `services/index.ts`.
- **data-access:** Slices `{feature}Slice.ts` o hooks `use{Feature}*.ts`; barrel `data-access/index.ts`.
- **pages/components:** Por pantalla o recurso (ej. `ProductosPage`, `InventoryPage`, `AlertsTable`).
- **shell:** `{Feature}Shell.tsx` o equivalente; barrel `shell/index.ts`.

---

## Dependencias permitidas

- `@biosstel/ui`, `@biosstel/ui-layout`, `@biosstel/platform`, `@biosstel/shared`, `@biosstel/shared-types`.
- **No** otras features (salvo excepciones documentadas).

---

## Referencia

- [plans/arquitectura-front.md](../../plans/arquitectura-front.md) — Principios y capas.
- [plans/FRONTEND_BOUNDARIES.md](../../plans/FRONTEND_BOUNDARIES.md) — Boundaries y excepciones feature→feature.
