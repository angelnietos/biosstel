# Frontend Biosstel

Aplicación web del monorepo: **Next.js 16** con App Router, **React 19**, **TypeScript**, **next-intl** (i18n) y **Redux Toolkit**. Ejecuta en el puerto **3000**.

---

## Índice

| Sección | Contenido |
|--------|-----------|
| [Stack y estructura](#stack-y-estructura) | Tecnologías y carpetas |
| [Arquitectura](#arquitectura) | Shell, features, store global |
| [Rutas y navegación](#rutas-y-navegación) | App Router, locale, catch-all |
| [Estado global (Redux)](#estado-global-redux) | Store, slices, hooks |
| [Features](#features) | Listado de libs frontend |
| [Variables de entorno](#variables-de-entorno) | NEXT_PUBLIC_* |
| [Comandos](#comandos) | dev, build, lint |

---

## Stack y estructura

| Tecnología | Uso |
|------------|-----|
| Next.js 16 | Framework, App Router, SSR/SSG |
| React 19 | UI |
| TypeScript | Tipado |
| next-intl | i18n (es, en) |
| Redux Toolkit | Estado global (slices por feature) |
| Tailwind CSS | Estilos |

Estructura típica de la app:

```
apps/front-biosstel/
├── src/
│   ├── app/
│   │   ├── [locale]/              # Rutas con idioma (/es, /en)
│   │   │   └── [[...path]]/       # Catch-all: shell resuelve la ruta
│   │   ├── layout.tsx
│   │   └── providers.tsx          # Redux Provider, AuthRestore
│   └── ...
├── public/
├── package.json
└── README.md
```

La lógica de **páginas** y **estado** vive en **libs**; la app solo orquesta layout, providers y el catch-all.

---

## Arquitectura

```text
front-biosstel (Next.js)
    │
    ├── Providers (Redux store desde @biosstel/shell)
    │
    └── [locale]/[[...path]]  →  CatchAllPage (@biosstel/shell)
                                      │
                                      ├── routeRegistry (mapea path → feature)
                                      └── Carga dinámica del componente de la feature
                                            (DashboardHomePage, ProductosPage, etc.)
```

- **Shell** (`@biosstel/shell`): define el **store global**, el **registro de rutas** y el **layout** (sidebar, navegación). No contiene pantallas; solo decide qué feature renderizar según la URL.
- **Features** (`@biosstel/auth`, `@biosstel/usuarios`, etc.): cada una expone **páginas**, **data-access** (Redux slices + hooks) y **api/services** (llamadas HTTP). Las páginas usan solo `dispatch(thunk)` y `useSelector`; no importan directamente de `api/services`.
- **UI compartida**: `@biosstel/ui`, `@biosstel/ui-layout`, `@biosstel/platform` (Link, useRouter compatibles con next-intl).

Diagramas detallados: [docs/ARQUITECTURA_DIAGRAMAS.md](../../docs/ARQUITECTURA_DIAGRAMAS.md).

---

## Rutas y navegación

- **Prefijo de idioma**: Todas las rutas tienen locale (`/es/...`, `/en/...`). Lo gestiona Next.js con `[locale]` y next-intl.
- **Catch-all**: `[[...path]]` delega en el **shell**. El shell lee el path, consulta el **routeRegistry** y carga el componente de la feature correspondiente (lazy).
- **Navegación**: Usar siempre `useRouter`, `Link`, `usePathname` desde **`@biosstel/platform`** (no desde `next/navigation`) para que el prefijo de idioma se mantenga.

Ejemplos de rutas (con locale `es`):

| Path | Feature | Página principal |
|------|---------|------------------|
| `/es` / `/es/home` | objetivos | DashboardHomePage |
| `/es/users` | usuarios | Listado usuarios |
| `/es/users/:id` | usuarios | DetalleUsuario |
| `/es/fichajes/control-jornada` | fichajes | ControlJornada |
| `/es/objetivos-terminales` | objetivos | TerminalObjectivesPage |
| `/es/empresa/departamentos` | empresa | Departamentos |
| `/es/productos` | productos | ProductosPage |
| `/es/inventory` | inventory | InventoryPage |
| `/es/reports` | reports | ReportsPage |

---

## Estado global (Redux)

- El **store** se crea en el **shell** (`libs/frontend/shell/src/store/store.ts`) y se inyecta en la app vía `<AppProviders store={store}>`.
- Cada **feature** aporta su **reducer** (auth, users, dashboard, fichajes, alertas, empresa, operaciones, reports, inventory, productos). El shell los combina bajo claves (`STORE_KEYS.auth`, `STORE_KEYS.users`, etc.).
- En **shell** y **app** se usan `useAppDispatch` y `useAppSelector` (y `STORE_KEYS`) desde `@biosstel/shell`. En las **features** se usa `useDispatch`/`useSelector` de `react-redux` (mismo store, sin depender del shell para evitar ciclos).
- Las llamadas al API viven en **thunks** dentro de cada feature; las páginas solo despachan thunks y leen estado.

Documentación del store: [libs/frontend/shell/src/store/README.md](../../libs/frontend/shell/src/store/README.md).

---

## Features

| Lib | Alias | Contenido principal |
|-----|-------|---------------------|
| auth | @biosstel/auth | Login, logout, forgot password, AuthRestore |
| usuarios | @biosstel/usuarios | CRUD usuarios, clientes, detalle, documentación |
| objetivos | @biosstel/objetivos | Dashboard home, objetivos terminales |
| fichajes | @biosstel/fichajes | Control jornada, tareas, historial |
| empresa | @biosstel/empresa | Departamentos, centros de trabajo, cuentas |
| alertas | @biosstel/alertas | Alertas (tracking, recordatorios, ventas) |
| productos | @biosstel/productos | Productos (listado, crear, editar) |
| inventory | @biosstel/inventory | Inventario |
| reports | @biosstel/reports | Informes / resumen |
| operaciones | @biosstel/operaciones | Operaciones (listados) |

Cada feature tiene: `api/` (servicios HTTP), `data-access/` (store, thunks, hooks), `pages/` (componentes de pantalla), `shell/` (rutas propias de la feature).

---

## Variables de entorno

En la **raíz del monorepo** (o donde se ejecute la app) se usa un `.env` con al menos:

```env
# URL base del API (obligatorio para el front)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Sin esto, las llamadas al API fallarán. En producción debe apuntar a la URL pública del API.

---

## Comandos

Desde la **raíz del monorepo**:

| Comando | Descripción |
|---------|-------------|
| `pnpm dev:front` | Desarrollo frontend (puerto 3000, hot reload) |
| `pnpm build:front` | Build de producción del frontend |
| `pnpm start` | Levanta todo (Docker: DB + API + Frontend) |

La app front no arranca sola con `pnpm dev` dentro de `apps/front-biosstel`; se usa el script del monorepo para tener resueltos los path aliases (`@biosstel/*`).

---

## Documentación relacionada

- [README principal del monorepo](../../README.md)
- [Diagramas de arquitectura](../../docs/ARQUITECTURA_DIAGRAMAS.md)
- [Store global (shell)](../../libs/frontend/shell/src/store/README.md)
- [Patrón Redux en features](../../docs/REDUX_PATTERN.md)
