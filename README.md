# Biosstel Monorepo

Monorepo full-stack modular con arquitectura hexagonal y feature-driven development: **Next.js 16 + React 19** en el frontend, **NestJS + TypeORM** en el backend, **PostgreSQL** como base de datos y **Nx + pnpm** para el monorepo.

---

## 📑 Índice

| Sección | Contenido |
|--------|-----------|
| [Arquitectura](#-arquitectura) | Stack, módulos, diagrama de dependencias |
| [Diagramas](#-diagramas-de-arquitectura) | Sistema, front, back, base de datos |
| [Inicio rápido](#-inicio-rápido) | `pnpm fresh-start`, `pnpm start`, prerrequisitos |
| [Comandos](#-comandos-disponibles) | Desarrollo, build, BD, Docker, lint, tests |
| [API REST](#-api-rest) | Base URL, Swagger, lista de endpoints |
| [Backend](#-arquitectura-del-backend) | Hexagonal, live reload |
| [Frontend](#-arquitectura-del-frontend) | Features, UI, estado, navegación |
| [Variables de entorno](#-variables-de-entorno) | `.env` y credenciales |
| [Docker](#-docker) | Puertos, desarrollo, producción |
| [Librerías](#-estructura-de-librerías) | Backend, frontend, shared-types |
| [Shared Types](#-shared-types-fuente-de-verdad) | Tipos compartidos y uso |
| [Testing](#-testing) | Vitest, Playwright |
| [Troubleshooting](#-troubleshooting) | Errores frecuentes y soluciones |
| [CI/CD](#-cicd) | GitHub Actions, branching |
| [Checklist pre-producción](#-checklist-pre-producción) | Compilación, tests, lint y verificación antes de desplegar |
| [Documentación completa](#-documentación-completa-docs) | Índice de todos los documentos en `docs/` y relacionados |
| [Resumen visual](#-resumen-visual) | Flujo de desarrollo y arquitectura |

**Documentación en `docs/`:** [CI_CD.md](docs/CI_CD.md), [TESTING.md](docs/TESTING.md), [API_RESPONSES.md](docs/API_RESPONSES.md), [DESIGN_TOKENS_FIGMA.md](docs/DESIGN_TOKENS_FIGMA.md), [BOUNDARIES_AND_TYPES.md](docs/BOUNDARIES_AND_TYPES.md) (boundaries Nx, ESLint y tipos compartidos). [NX_COMANDOS.md](docs/NX_COMANDOS.md) (generadores sin colgarse: usar `--no-interactive`). [SENTRY_Y_FLOW_LOG.md](docs/SENTRY_Y_FLOW_LOG.md) (monitorización y log de flujo en dev). [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) (EACCES en pnpm, etc.). [CHECKLIST_PRE_PRODUCCION.md](docs/CHECKLIST_PRE_PRODUCCION.md) (verificación antes de producción). [CONFIG_SERVER.md](docs/CONFIG_SERVER.md) (config por feature, `/api/v1/config`, GraphQL activable).

- **Diagramas de arquitectura (sistema, front, back, BD):** [docs/ARQUITECTURA_DIAGRAMAS.md](docs/ARQUITECTURA_DIAGRAMAS.md) — diagramas Mermaid: vista general, monorepo, frontend, backend hexagonal, modelo de datos PostgreSQL, flujo de peticiones.
- **Apps (front + API):** [apps/README.md](apps/README.md) — resumen de aplicaciones. Documentación detallada: [front-biosstel](apps/front-biosstel/README.md) (frontend), [api-biosstel](apps/api-biosstel/README.md) (API y base de datos).
- **Comparativa proyecto heredado vs monorepo y presentaciones:** [docs/mejroasaplicadas/README.md](docs/mejroasaplicadas/README.md) — presentaciones HTML (comparativa, devs, arquitectura, plan), informe de problemas, guion para empresa. [ESTADO_FUNCIONALIDADES_Y_TESTS.md](docs/ESTADO_FUNCIONALIDADES_Y_TESTS.md) — estado de features y tests.

---

## 🏗️ Arquitectura

### Stack Tecnológico

| Capa          | Tecnología                            |
| ------------- | ------------------------------------- |
| Frontend      | Next.js 16 + React 19 + TypeScript    |
| Backend       | NestJS + REST API + TypeORM           |
| Base de datos | PostgreSQL                            |
| Autenticación | JWT + Passport                        |
| Monorepo      | Nx + pnpm Workspaces                  |
| Testing       | Vitest + Playwright                   |
| Contenedores  | Docker + Docker Compose               |
| Desarrollo    | tsx (live reload con archivos fuente) |
| CI/CD         | GitHub Actions                        |

### Arquitectura Modular Full-Stack

El proyecto sigue una arquitectura **modular y escalable** donde:

- **Frontend**: Features con `pages`, `shell`, `data-access`, `components`
- **Backend**: Features con **Arquitectura Hexagonal** (Ports & Adapters)
- **Shared**: Tipos, enums, utils compartidos entre frontend y backend

```
biosstel-monorepo/
├── apps/
│   ├── front-biosstel/              # Next.js 16 Frontend (App Router, next-intl)
│   └── api-biosstel/                # NestJS Backend API
├── libs/
│   ├── frontend/
│   │   ├── features/                # auth, usuarios, objetivos, fichajes, operaciones, empresa, alertas
│   │   ├── ui/                      # Componentes atómicos (Storybook)
│   │   ├── ui-layout/               # Layouts (PageContainer, SidebarLayout)
│   │   ├── shared/                  # AuthLayout, PageContent
│   │   └── platform/                # Navegación (useRouter, Link) compatible next-intl
│   ├── backend/                     # Features con arquitectura hexagonal
│   │   ├── api-auth/
│   │   ├── api-usuarios/
│   │   ├── api-objetivos/
│   │   ├── api-fichajes/
│   │   ├── api-alertas/
│   │   ├── api-operaciones/
│   │   ├── api-empresa/
│   │   ├── api-productos/           # Productos, inventario, informes
│   │   └── api-shared/
│   └── shared-types/                # Tipos compartidos (fuente de verdad)
├── scripts/                         # clean.js, ensure-docker.js
└── plans/                           # Documentación de arquitectura
```

> 📖 **Documentación de arquitectura**: [plans/HEXAGONAL_ARCHITECTURE.md](plans/HEXAGONAL_ARCHITECTURE.md), [plans/arquitectura-api.md](plans/arquitectura-api.md), [plans/arquitectura-front.md](plans/arquitectura-front.md)

### 📐 Diagramas de arquitectura

En [docs/ARQUITECTURA_DIAGRAMAS.md](docs/ARQUITECTURA_DIAGRAMAS.md) hay diagramas Mermaid con:

- **Vista general del sistema**: navegador ↔ frontend ↔ API ↔ PostgreSQL.
- **Estructura del monorepo**: apps, libs frontend/backend, shared-types.
- **Arquitectura del frontend**: shell, features, store global, flujo Redux.
- **Arquitectura del backend**: hexagonal, módulos api-*.
- **Base de datos**: modelo entidad-relación (tablas y relaciones).
- **Flujo de una petición**: ejemplo login (front → store → API → BD).
- **Puertos**: 3000 (front), 4000 (API), 5434 (Postgres), 8080 (Adminer).

### Diagrama de Dependencias

```
Frontend (Next.js 16 – App Router)
  ├── libs/frontend/features/* (auth, usuarios, objetivos, fichajes, operaciones, empresa, alertas)
  │   ├── shell/                    # Shell por feature (rutas, layout)
  │   ├── data-access/              # Redux slices, hooks, API
  │   ├── pages/                    # Components + layouts por página
  │   ├── types/ + api/
  │   └── index.ts
  ├── libs/frontend/ui              # Componentes atómicos (Button, Input, Chip, Toast, etc.)
  ├── libs/frontend/ui-layout       # PageContainer, SidebarLayout, CenteredLayout
  ├── libs/frontend/shared          # AuthLayout, PageContent (compartidos entre features)
  ├── libs/frontend/platform        # useRouter, Link, redirect (compatibles con next-intl)
  └── libs/shared-types             # Tipos compartidos con backend

Backend (NestJS) – Arquitectura Hexagonal
  ├── libs/backend/api-* (api-auth, api-usuarios, api-objetivos, api-fichajes, api-alertas, api-operaciones, api-empresa, api-productos)
  │   ├── application/              # Use cases + ports (input / output)
  │   └── infrastructure/            # api (Controllers) + persistence (TypeORM)
  ├── libs/backend/api-shared       # Utilidades compartidas
  └── libs/shared-types             # Tipos compartidos
```

## 🚀 Inicio Rápido

**Para quien no conozca el proyecto:** instalar dependencias y arrancar todo con un solo comando:

```bash
pnpm install
pnpm start
```

Con eso se levanta **Docker** con Postgres, API (puerto 4000), Frontend (3000) y **live reload** en API y Front. No hace falta tocar nada más.

**Arranque completo desde cero (clean install + Docker):** si quieres limpiar `node_modules`, cachés y volver a instalar todo antes de arrancar:

```bash
pnpm fresh-start
```

Hace: 1) limpieza (`node_modules`, `dist`, `.next`, cachés), 2) `pnpm install`, 3) `pnpm start` (Docker). Útil después de cambiar de rama, actualizar Node/pnpm o cuando algo quede en un estado raro.

### Comandos principales (todo en `package.json`)

| Comando | Descripción |
|--------|-------------|
| **`pnpm fresh-start`** | Limpieza completa (node_modules, dist, .next, cachés) + install + start con Docker. Arranque desde cero. |
| **`pnpm start`** / **`pnpm dev`** | Levanta todo con Docker: Postgres (5434), Adminer (8080), API (4000), Frontend (3000). Incluye live reload. |
| **`pnpm start:fresh`** | Resetea la BD y levanta todo el stack (BD limpia + servicios). |
| **`pnpm start:local`** / **`pnpm dev:local`** | API + Frontend en local en paralelo (requiere `pnpm db:start` antes). |
| **`pnpm dev:api`** | Solo API en local con live reload (requiere `pnpm db:start`). |
| **`pnpm dev:front`** | Solo Frontend en local con live reload. |
| **`pnpm build`** | Build de producción: API + Frontend. |
| **`pnpm build:api`** / **`pnpm build:front`** | Build solo de API o solo de Frontend. |
| **`pnpm clean`** | Borra node_modules, dist, .next y cachés. No instala ni arranca. |
| **`pnpm db:start`** | Solo Postgres + Adminer (para desarrollar en local). |
| **`pnpm db:stop`** | Detiene contenedores del compose de desarrollo. |
| **`pnpm db:seed`** | Pobla la BD con datos de prueba. |
| **`pnpm db:reset`** | Borra volúmenes y vuelve a crear BD. |
| **`pnpm db:reset:seed`** | Resetea BD y ejecuta seed (si falla el seed, ejecutar `pnpm db:seed` de nuevo a los pocos segundos). |
| **`pnpm docker:dev:build`** | Levanta el stack con rebuild de imágenes. |
| **`pnpm docker:dev:reset`** | Borra contenedores y volúmenes y vuelve a levantar. |
| **`pnpm logs`** / **`logs:api`** / **`logs:front`** | Logs de todos los servicios o de uno. |
| **`pnpm restart`** / **`restart:api`** / **`restart:front`** | Reinicia todos los servicios o uno. |
| **`pnpm lint`** / **`pnpm lint:fix`** | Lint en todo el monorepo; lint:fix aplica correcciones. |
| **`pnpm validate`** | Ejecuta lint + typecheck + test (útil pre-commit o CI). |
| **`pnpm graph`** | Abre el grafo de dependencias del monorepo (Nx). |

Todo está definido en **`package.json`**. Listado completo con descripción de cada script: **[SCRIPTS.md](SCRIPTS.md)**.

Opcional: `pnpm monitoring:up` → Grafana (3002), Prometheus (9090).

### Prerrequisitos

- **Node.js** >= 20.0.0 ([Descargar](https://nodejs.org/))
- **pnpm** >= 10 (el proyecto usa `packageManager: "pnpm@10.29.3"` en package.json)
- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop/))
- **Git** ([Descargar](https://git-scm.com/))

### Instalación Paso a Paso

#### 1️⃣ Clonar e Instalar Dependencias

```bash
# Clonar el repositorio
git clone <repository-url>
cd babooni

# Opción rápida: limpiar (si ya habías clonado antes), instalar e arrancar todo con Docker
pnpm fresh-start

# Opción manual: solo instalar dependencias
pnpm install
```

#### 2️⃣ Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (o copia `.env.example` si existe):

```env
# Base de datos (coincide con Docker: pnpm db:start expone Postgres en 5434)
DB_HOST=localhost
DB_PORT=5434
DB_USER=biosstel
DB_PASSWORD=biosstel123
DB_NAME=biosstel

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# API
PORT=4000
NODE_ENV=development
# CORS: el backend acepta 3000 y 3001 por defecto en dev
CORS_ORIGIN=http://localhost:3000

# Frontend (puerto 3000 o 3001; debe coincidir con donde levantes el front)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Opcional: Config Server (settings.json en raíz tiene prioridad)
# GRAPHQL_ENABLED=true
# GRAPHQL_FEATURES=users
# GRAPHQL_PATH=/graphql
```

*Config por feature (adapters, BD, GraphQL): copiar `settings.json.example` a `settings.json` o usar variables de entorno. Ver [docs/CONFIG_SERVER.md](docs/CONFIG_SERVER.md).*

#### 3️⃣ Iniciar la base de datos (Docker)

```bash
pnpm db:start
```

PostgreSQL y Adminer se levantan en Docker. Postgres queda expuesto en el puerto **5434** (para no chocar con una instalación local en 5432).

- **Adminer**: http://localhost:8080 (Sistema: PostgreSQL, Servidor: host.docker.internal, Puerto: **5434**, Usuario: biosstel, Contraseña: biosstel123)

#### 4️⃣ Poblar la base de datos (seed)

Con el `.env` anterior y la base de datos ya levantada (`pnpm db:start`):

```bash
pnpm db:seed
```

**Resultado esperado** (salida típica de `pnpm db:seed` con `seed.ts`):

```
🌱 Starting database seed...
✅ Connected to database
📝 Creating seed users...
✅ Created user: admin@biosstel.com (Password: admin123)
✅ Created user: coordinador@biosstel.com (Password: coord123)
... (y el resto de usuarios)
📋 Seeding clients...
✅ Seeded 3 clients
🧩 Seeding dashboard objectives...
✅ Seeded dashboard objectives
🚨 Seeding dashboard alerts...
✅ Seeded dashboard alerts
🎯 Seeding terminal objectives...
✅ Seeded terminal objectives + assignments
... (fichajes, tasks, etc.)
🎉 Seed completed successfully!
```

**Usuarios de prueba creados** (según seed en uso: `seed.ts` o `docker/seed.sql`):

| Email | Password | Rol |
|-------|----------|-----|
| admin@biosstel.com | admin123 | ADMIN |
| coordinador@biosstel.com | coord123 | COORDINADOR |
| telemarketing@biosstel.com | tm123 | TELEMARKETING |
| tienda@biosstel.com | tienda123 | TIENDA |
| comercial@biosstel.com | comercial123 | COMERCIAL |
| backoffice@biosstel.com | bo123 | BACKOFFICE |
| usuario@biosstel.com | user123 | COMERCIAL *(solo en seed.ts)* |

#### 5️⃣ Iniciar todo (recomendado)

```bash
pnpm start
```

Levanta **todo el stack con Docker Compose**: Postgres, Adminer, API (4000) y Frontend (3000).  
Si en el paso 1 usaste **`pnpm fresh-start`**, el proyecto ya está arrancado; puedes ir a la sección **Comprobar que todo funciona**. **Incluye live reload**: al guardar cambios en API (NestJS) o Frontend (Next.js) se recarga solo. La primera vez puede tardar (build de imágenes e instalación de deps); si algo falla, prueba `pnpm docker:dev:build`.

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api (rutas versionadas: /api/v1/...)
- **Swagger**: http://localhost:4000/api/docs
- **Adminer**: http://localhost:8080 (Servidor: `postgres`, Puerto: 5432, Usuario: biosstel, Contraseña: biosstel123)

**Sin Docker (solo API + Front en local):** primero `pnpm db:start`, luego `pnpm dev:local`. Para solo API o solo Front: `pnpm dev:api` o `pnpm dev:front` (también con live reload).

#### 6️⃣ (Opcional) Grafana y monitoring

Si quieres métricas y dashboards:

```bash
pnpm monitoring:up
```

- **Grafana**: http://localhost:3002 (usuario: `admin`, contraseña: `admin`)
- Prometheus: http://localhost:9090

#### 7️⃣ Comprobar que todo funciona

| Servicio     | URL                                               |
| ------------ | ------------------------------------------------- |
| 🌐 Frontend  | http://localhost:3000                             |
| 🔌 API       | http://localhost:4000/api                         |
| 📖 Swagger   | http://localhost:4000/api/docs                    |
| 💚 Health    | http://localhost:4000/api/health (live: /api/health/live) |
| ⚙️ Config    | http://localhost:4000/api/v1/config                |
| 🗄️ Adminer   | http://localhost:8080                             |
| 📊 Grafana   | http://localhost:3002 (tras `pnpm monitoring:up`) |
| 📚 Storybook | http://localhost:6006                             |

**Login de prueba**: email `admin@biosstel.com`, contraseña `admin123`. En Swagger (http://localhost:4000/api/docs) usa **POST /auth/login** y luego **Authorize** con el `access_token` para probar el resto de endpoints.

---

### 🔄 Comandos Útiles del Día a Día

```bash
# Si necesitas resetear la base de datos
pnpm db:reset          # Elimina todos los datos
pnpm db:seed           # Vuelve a poblar

# Si cambias el schema de TypeORM
# No necesitas hacer nada - synchronize:true en dev
# Los cambios se aplican automáticamente

# Ver logs de la base de datos
pnpm db:logs

# Detener la base de datos
pnpm db:stop

# Reiniciar API + front: Ctrl+C y luego pnpm start
```

## 📋 Comandos Disponibles

> 📄 **Referencia completa**: [SCRIPTS.md](SCRIPTS.md) — descripción de cada script de `package.json`.

### 🎯 Desarrollo

| Comando                | Descripción                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `pnpm fresh-start`     | Limpieza + install + start con Docker (arranque completo desde cero)         |
| `pnpm start` / `pnpm dev` | Levanta todo con Docker Compose (Postgres, Adminer, API, Frontend)       |
| `pnpm start:fresh`     | Resetea BD y levanta todo el stack                                          |
| `pnpm start:local` / `pnpm dev:local` | API + Frontend en local (requiere `pnpm db:start`)                  |
| `pnpm dev:api`         | Solo API (puerto 4000) con live reload                                      |
| `pnpm dev:front`       | Solo Frontend (puerto 3000)                                                  |
| `pnpm storybook`       | Catálogo de componentes UI en http://localhost:6006                          |
| `pnpm build-storybook` | Build estático de Storybook (para deploy)                                   |

### 📚 Storybook (componentes UI)

La librería **`@biosstel/ui`** tiene su catálogo en Storybook para ver y probar componentes (Button, Input, Chip, Tooltip, InputPassword, ErrorFormMsg, etc.) sin levantar el frontend.

```bash
pnpm storybook
```

Se abre en **http://localhost:6006**. Útil para desarrollo de componentes, revisión de variantes y documentación viva.

### 🏗️ Build

| Comando            | Descripción                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `pnpm build`       | Build completo (API + Frontend). Front usa `NODE_ENV=production` (target Nx). |
| `pnpm build:api`   | Solo build de API (shared-types + libs backend)                             |
| `pnpm build:front` | Solo build de Frontend (libs front compiladas a `dist/`, luego Next.js)     |
| `pnpm build:all`   | Build de todos los proyectos del monorepo (NX)                              |
| `pnpm build:types` | Rebuild de shared-types (`libs/shared-types/dist/`)                         |

El build del frontend compila antes las libs (ui, ui-layout, platform, shared, features) con `tsconfig.build.json` que apunta a `dist/` para evitar conflictos de `rootDir`. La app Next.js tiene `global-error.tsx` para manejo de errores en producción.

### 🗄️ Base de datos

| Comando         | Descripción                                                  |
| --------------- | ------------------------------------------------------------ |
| `pnpm db:start` | Inicia PostgreSQL + Adminer en Docker (puerto 5434)          |
| `pnpm db:stop`  | Detiene contenedores de BD                                   |
| `pnpm db:reset` | Elimina volúmenes y vuelve a levantar Postgres + Adminer     |
| `pnpm db:logs`  | Logs de PostgreSQL                                           |
| `pnpm db:seed`  | Poblar BD con datos de prueba (requiere .env y BD levantada) |

### 📊 Monitoring (Grafana, Prometheus)

| Comando                | Descripción                                               |
| ---------------------- | --------------------------------------------------------- |
| `pnpm monitoring:up`   | Levanta Grafana (3002), Prometheus (9090), Loki, Promtail |
| `pnpm monitoring:down` | Detiene los contenedores de monitoring                    |

### 🐳 Docker (dev completo en contenedores)

| Comando                | Descripción                                  |
| ---------------------- | -------------------------------------------- |
| `pnpm docker:dev:full` | Como start + Grafana y Prometheus            |
| `pnpm db:stop`         | Para contenedores de dev (BD, Adminer, etc.) |

#### 📊 Sobre el Seed de Datos

El proyecto dispone de dos formas de poblar la base de datos:

1. **`pnpm db:seed`** — Script Node (`apps/api-biosstel/seed.ts`): usa TypeORM y las entidades del monorepo; crea tablas con `synchronize: true` si no existen y rellena datos. Idempotente por entidad (no duplica usuarios, objetivos, etc.).
2. **Docker** — Al arrancar con `pnpm start`, el compose puede ejecutar `docker/02-seed.sql` (o manualmente `docker/seed.sql`). Incluye usuarios, dashboard, terminal objectives/assignments, alertas, fichajes, departamentos, centros de trabajo, productos, inventario, clientes, calendarios/horarios/permisos.

**Datos que quedan disponibles** (según el seed que uses):

| Área | Contenido |
|------|-----------|
| **Usuarios** | 6–7 usuarios (admin, coordinador, telemarketing, tienda, comercial, backoffice; opcional usuario) con contraseñas hasheadas (bcrypt). |
| **Dashboard** | 4 objetivos (Terminales/Familia Y/Familia/Producto X), 7 alertas (no-fichado, fuera-horario). |
| **Objetivos terminales** | Objetivos actuales por tipo: contratos y puntos; asignaciones por departamento y persona; histórico por periodo (ej. Nov/Oct/Sep 2025). |
| **Clientes** | 3 clientes de ejemplo (nombre, email, teléfono). |
| **Empresa** | Departamentos (Comercial, Tienda, Telemarketing) y centros de trabajo (Barakaldo, Las Arenas, Sede central). |
| **Productos e inventario** | Productos de ejemplo (PRD-001/002/003) e ítems de inventario (INV-001/002/003). |
| **Fichajes** | Fichajes del día actual para usuarios de prueba (working, paused, finished). |
| **Tareas** | Tareas asociadas a usuarios (solo en `seed.ts`). |
| **Calendarios/horarios/permisos** | Tipos de calendario, jornada y permisos (solo si las tablas existen y están vacías). |

**Características**:

- ✅ **Idempotente**: Ejecutarlo varias veces no duplica datos (UPSERT o comprobación por existencia).
- ✅ **TypeORM / SQL**: `seed.ts` usa entidades; `docker/seed.sql` usa SQL directo.
- ✅ **Desarrollo rápido**: Todas las pantallas del front (dashboard, objetivos, usuarios, fichajes, alertas, empresa, productos, inventario, informes) tienen datos coherentes.

**Cuándo ejecutarlo**:

- ✅ Primera vez que configuras el proyecto.
- ✅ Después de `pnpm db:reset` (elimina todos los datos).
- ✅ Cuando necesitas restaurar datos de prueba.

**Archivos**: `apps/api-biosstel/seed.ts` (Node) y `docker/seed.sql` (PostgreSQL).

### 🐳 Docker Producción

| Comando                 | Descripción                                      |
| ----------------------- | ------------------------------------------------ |
| `pnpm docker:prod`      | Build e inicia servicios de producción en Docker |
| `pnpm docker:prod:down` | Detiene contenedores de producción               |
| `pnpm docker:prod:logs` | Ver logs de contenedores de producción           |

### 🔍 Linting, Type Checking y Tipos Compartidos

| Comando                | Descripción                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `pnpm lint`            | Lint de todos los proyectos                                        |
| `pnpm lint:api`        | Solo lint de API                                                   |
| `pnpm lint:front`      | Solo lint de Frontend                                              |
| `pnpm typecheck`       | Type check de todos los proyectos                                  |
| `pnpm typecheck:api`   | Solo type check de API                                             |
| `pnpm typecheck:front` | Solo type check de Frontend                                        |
| `pnpm build:types`     | Rebuild de `@biosstel/shared-types` (regenera `dist/`)             |
| `pnpm build:all`       | Build completo (shared-types + todas las libs + apps)              |

> **Nota**: Antes de hacer un commit, se recomienda ejecutar `pnpm typecheck` y `pnpm lint` para asegurar que no hay errores de tipos ni de estilo.

### 🧪 Testing

| Comando                   | Descripción                        |
| ------------------------- | ---------------------------------- |
| `pnpm test`               | Tests unitarios (Vitest)           |
| `pnpm test:ui`            | Tests con UI interactiva           |
| `pnpm test:api`           | Solo tests de API                  |
| `pnpm test:front`         | Solo tests de Frontend             |
| `pnpm test:e2e`           | Tests E2E (Playwright)             |
| `pnpm test:e2e:ui`        | Tests E2E con UI interactiva       |
| `pnpm test:e2e:api`       | Tests E2E de API                   |
| `pnpm test:e2e:front`     | Tests E2E de Frontend              |
| `pnpm test:e2e:all`       | Todos los tests E2E                |
| `pnpm playwright:install` | Instalar navegadores de Playwright |

> **Detalle:** [docs/TESTING.md](docs/TESTING.md) — cómo reproducir tests en local, cobertura y E2E.

### 🔧 Utilidades y limpieza

| Comando        | Descripción                                                    |
| -------------- | -------------------------------------------------------------- |
| `pnpm clean`   | Borra node_modules, dist, .next y cachés (no instala ni arranca). |
| `pnpm fresh-start` | clean + install + start (arranque completo desde cero con Docker). |
| `pnpm run pnpm:fix-install` | Si `pnpm install` falla por EACCES: limpia y reinstala (ver [TROUBLESHOOTING](docs/TROUBLESHOOTING.md)). |
| `pnpm nx`      | Ejecutar comandos de Nx                                        |
| `pnpm ci`      | Instalación para CI (frozen lockfile)                          |

## 🔌 API REST

### Base URL

```
http://localhost:4000/api/v1
```

> **Nota**: El API utiliza versionado por URI. La versión actual por defecto es `v1`.

### Documentación

- **Swagger UI**: http://localhost:4000/api/docs
- **API V1**: http://localhost:4000/api/v1
- **Health**: http://localhost:4000/api/health (completo), http://localhost:4000/api/health/live (liveness), http://localhost:4000/api/health/ready (readiness con DB)
- **Config Server**: http://localhost:4000/api/v1/config y http://localhost:4000/api/v1/config/features — configuración por feature (adapters, BD, URLs). El health completo incluye el indicador del Config Server. Ver [docs/CONFIG_SERVER.md](docs/CONFIG_SERVER.md).
- **GraphQL (opcional)**: Si está habilitado en `settings.json` (`graphql.enabled: true`, `graphql.features: ["users"]`), el endpoint está en http://localhost:4000/graphql (path configurable). REST sigue funcionando en paralelo.

### Endpoints Principales

Todos bajo prefijo **`/api/v1`**. La mayoría requieren cabecera `Authorization: Bearer <token>` (obtener token con `POST /auth/login`).

| Método | Endpoint | Descripción | Auth |
|--------|----------|--------------|------|
| **Auth** | | | |
| POST | `/auth/login` | Iniciar sesión (email, password) | ❌ |
| GET | `/auth/me` | Perfil del usuario actual | ✅ |
| POST | `/auth/forgot-password` | Solicitar restablecimiento | ❌ |
| **Usuarios** | | | |
| GET | `/users` | Listar usuarios (paginado) | ✅ |
| GET | `/users/:id` | Obtener usuario | ✅ |
| POST | `/users` | Crear usuario | ✅ |
| PUT | `/users/:id` | Actualizar usuario | ✅ |
| DELETE | `/users/:id` | Eliminar usuario | ✅ |
| GET | `/users/:userId/documents` | Listar documentos del usuario | ✅ |
| POST | `/users/:userId/documents` | Subir documento | ✅ |
| **Clientes** | | | |
| GET | `/clients` | Listar clientes | ✅ |
| POST | `/clients` | Crear cliente (name, email, phone) | ✅ |
| **Dashboard y objetivos** | | | |
| GET | `/dashboard/home` | Resumen home (objetivos, alertas, fichaje actual) | ✅ |
| GET | `/dashboard/terminal-objectives` | Objetivos terminales (query: type, period) | ✅ |
| PATCH | `/dashboard/terminal-objectives/:id` | Activar/desactivar objetivo terminal | ✅ |
| **Empresa** | | | |
| GET | `/empresa` | Datos de empresa | ✅ |
| GET | `/empresa/departments` | Listar departamentos | ✅ |
| GET/POST/PUT/DELETE | `/empresa/departments/:id` | CRUD departamento | ✅ |
| GET | `/empresa/work-centers` | Listar centros de trabajo | ✅ |
| GET/POST/PUT/DELETE | `/empresa/work-centers/:id` | CRUD centro de trabajo | ✅ |
| **Fichajes y tareas** | | | |
| GET | `/fichajes` | Listar fichajes | ✅ |
| GET | `/fichajes/current?userId=` | Fichaje actual del usuario (incl. fueraHorario) | ✅ |
| POST | `/fichajes/clock-in` | Fichar entrada | ✅ |
| POST | `/fichajes/:fichajeId/clock-out` | Fichar salida | ✅ |
| POST | `/fichajes/:fichajeId/pause` | Pausar | ✅ |
| POST | `/fichajes/:fichajeId/resume` | Reanudar | ✅ |
| GET | `/fichajes/calendars`, `/fichajes/schedules`, `/fichajes/permission-types` | Calendarios, horarios, tipos permiso | ✅ |
| GET | `/tasks/user/:userId` | Tareas del usuario | ✅ |
| GET/POST/PATCH/DELETE | `/tasks`, `/tasks/:taskId` | CRUD tareas | ✅ |
| **Productos e inventario** | | | |
| GET/POST | `/productos` | Listar / crear producto | ✅ |
| GET/PATCH/DELETE | `/productos/:id` | Obtener / actualizar / eliminar producto | ✅ |
| POST | `/productos/:id/plantilla` | Subir plantilla CSV | ✅ |
| GET | `/inventory` | Listar inventario | ✅ |
| GET/POST/PATCH/DELETE | `/inventory`, `/inventory/:id` | CRUD ítems de inventario | ✅ |
| GET | `/reports/summary` | Resumen para informes | ✅ |
| **Alertas y operaciones** | | | |
| GET | `/alertas` | Listar alertas | ✅ |
| GET | `/operaciones` | Listar operaciones | ✅ |
| **Config (sin auth)** | | | |
| GET | `/config` | Configuración runtime (database, graphql, profile) | ❌ |
| GET | `/config/features` | Lista por feature (adapter, serviceUrl) | ❌ |

*Rutas de config versionadas: prefijo real `/api/v1/config`.*

## 🏗️ Arquitectura del Backend

### Arquitectura Hexagonal (Ports & Adapters)

El backend sigue una **arquitectura hexagonal** donde cada feature es una librería independiente:

```
libs/backend/api-usuarios/
├── src/
│   ├── application/ (ports/input, ports/output, use-cases)
│   ├── infrastructure/ (api/, persistence/)
│   ├── users.module.ts
│   ├── users.service.ts
│   └── index.ts
```

Ver [plans/HEXAGONAL_ARCHITECTURE.md](plans/HEXAGONAL_ARCHITECTURE.md) para detalle.

### Live Reload con Archivos Fuente

El backend está configurado para usar **archivos fuente directamente** en desarrollo:

- ✅ **Desarrollo**: Usa `tsx watch` con archivos fuente (`libs/*/src/index.ts`)
- ✅ **Producción**: Compila a `dist/` usando `@nx/js:tsc`
- ✅ **Live Reload**: Cambios en librerías se reflejan automáticamente
- ✅ **Sin compilación previa**: No necesitas compilar librerías antes de desarrollar

**Configuración**:

- `apps/api-biosstel/tsconfig.dev.json` - Paths a archivos fuente
- `apps/api-biosstel/dev.ts` - Entry point con `reflect-metadata` y `tsconfig-paths`
- `apps/api-biosstel/project.json` - Target `dev` usa `tsx watch`

## 🎨 Arquitectura del Frontend

### Feature-Driven Development

Cada feature tiene su propia estructura:

```
libs/frontend/features/auth/ (o usuarios, objetivos, etc.)
├── src/
│   ├── shell/
│   ├── data-access/
│   ├── pages/ (components + layouts)
│   ├── types/
│   └── api/
└── index.ts
```

### Librerías Compartidas (Frontend)

- **`libs/frontend/ui`** (`@biosstel/ui`): Componentes UI atómicos (Button, Input, Chip, Tooltip, ToastProvider, etc.). Incluye Storybook.
- **`libs/frontend/ui-layout`** (`@biosstel/ui-layout`): Layouts (PageContainer, SidebarLayout, CenteredLayout, MainContainer).
- **`libs/frontend/shared`** (`@biosstel/shared`): Componentes compartidos entre features: AuthLayout, PageContent.
- **`libs/frontend/platform`** (`@biosstel/platform`): Navegación y utilidades compatibles con next-intl (useRouter, usePathname, Link, redirect).
- **`libs/shared-types`** (`@biosstel/shared-types`): Tipos TypeScript compartidos entre frontend y backend (fuente de verdad).

### 🧠 Gestión de Estado (Redux Toolkit)

La aplicación utiliza una arquitectura de estado **modular y escalable**:

- **Store Global**: Configurado en `apps/front-biosstel/src/store/store.ts`.
- **Slices por Feature**: Cada feature (`libs/frontend/features/*`) define y exporta su propio Redux Slice.
- **Inyección Automática**: Los reducers de cada feature se inyectan en el store global.
- **Hooks Tipados**: Se utilizan `useDispatch` y `useSelector` dentro de los hooks de data-access de cada feature.

**Ejemplo de flujo**:

1. Un componente de la feature usuarios llama a `useUsers()` (hook de data-access).
2. `useUsers` despacha `fetchUsers()`.
3. El slice de usuarios actualiza el estado (`loading`, luego `users`).
4. El componente se re-renderiza con los datos.

### 🧭 Navegación y Localización

Para garantizar la compatibilidad con `next-intl` (i18n), **NO se deben usar los hooks de Next.js directamente**.

✅ **Correcto** (Importar de `@biosstel/platform`):

```typescript
import { useRouter, usePathname, Link, redirect } from '@biosstel/platform';

const router = useRouter(); // Maneja automáticamente el prefijo de idioma (/es, /en)
```

❌ **Incorrecto** (Importar de `next/navigation` o `next/router`):

```typescript
import { useRouter } from 'next/navigation'; // ESTO ROMPERÁ LA NAVEGACIÓN EN MULTI-IDIOMA
```

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5434
DB_USER=biosstel
DB_PASSWORD=biosstel123
DB_NAME=biosstel
DATABASE_URL=postgresql://biosstel:biosstel123@localhost:5434/biosstel

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# App
PORT=4000
NODE_ENV=development
# En dev el API suele aceptar 3000 y 3001; CORS_ORIGIN es opcional si usas los valores por defecto
CORS_ORIGIN=http://localhost:3000
```

### Credenciales de Base de Datos (Desarrollo)

| Campo         | Valor                          |
| ------------- | ------------------------------ |
| Servidor      | localhost                      |
| Puerto        | **5434** (importante: no 5432) |
| Usuario       | biosstel                       |
| Contraseña    | biosstel123                    |
| Base de datos | biosstel                       |

## 🐳 Docker

### Puertos

| Servicio   | Puerto | URL                       |
| ---------- | ------ | ------------------------- |
| Frontend   | 3000   | http://localhost:3000     |
| API        | 4000   | http://localhost:4000/api |
| PostgreSQL | 5434   | localhost:5434            |
| Adminer    | 8080   | http://localhost:8080     |

### Desarrollo

```bash
# Iniciar solo la base de datos
pnpm db:start

# Ver logs
pnpm db:logs

# Detener
pnpm db:stop

# Reset completo (elimina datos)
pnpm db:reset
```

### Producción

```bash
# Build y arrancar
pnpm docker:prod

# Ver logs
pnpm docker:prod:logs

# Detener
pnpm docker:prod:down
```

## 📦 Estructura de Librerías

### Backend (`libs/backend/`)

Cada feature backend es una librería independiente con **arquitectura hexagonal** (application + infrastructure):

| Librería          | Descripción                                      |
|-------------------|--------------------------------------------------|
| **api-auth**      | Autenticación (login, JWT, me, forgot-password)  |
| **api-usuarios**  | CRUD usuarios + documentos + **clientes**        |
| **api-objetivos** | Dashboard (home, terminal-objectives, PATCH)      |
| **api-fichajes**  | Fichajes (clock-in/out, pause/resume), tareas, calendarios, horarios, permisos |
| **api-alertas**   | Alertas de dashboard                              |
| **api-operaciones** | Operaciones (listado)                           |
| **api-empresa**   | Empresa, departamentos, centros de trabajo        |
| **api-productos** | Productos, inventario, informes (reports/summary), plantilla CSV |
| **api-shared**    | CQRS, eventos, métricas, utilidades compartidas   |

### Frontend (`libs/frontend/`)

| Tipo      | Librería      | Path alias           | Descripción |
|-----------|---------------|----------------------|-------------|
| Features  | auth, usuarios, objetivos, fichajes, operaciones, empresa, alertas, **productos**, **inventory**, **reports** | `@biosstel/auth`, `@biosstel/usuarios`, etc. | Shell, data-access, pages, types, api |
| UI        | ui            | `@biosstel/ui`       | Componentes atómicos + Storybook |
| Layout    | ui-layout     | `@biosstel/ui-layout`| PageContainer, SidebarLayout, CenteredLayout |
| Shared    | shared        | `@biosstel/shared`   | AuthLayout, PageContent |
| Platform  | platform      | `@biosstel/platform` | useRouter, Link, redirect (next-intl) |
| Shell     | shell         | —                    | Rutas y layout global (sidebar, navegación por features) |

### Compartido (`libs/`)

- **shared-types** (`@biosstel/shared-types`): Tipos TypeScript compartidos entre frontend y backend (fuente de verdad).

## 🔗 Shared Types (fuente de verdad)

`libs/shared-types` es la **unica fuente de verdad** para los tipos que comparten frontend y backend. Ningun proyecto debe duplicar tipos que ya existan aqui.

### Como funciona

1. Los tipos se definen **una sola vez** en `libs/shared-types/src/index.ts`.
2. Tanto el frontend como el backend importan desde `@biosstel/shared-types`.
3. Las libs backend que necesitan reexportar tipos lo hacen con `export type { X } from '@biosstel/shared-types'`.
4. En el build de NX, shared-types se compila primero y las demas libs resuelven contra su `dist/`.

### Tipos disponibles

| Tipo | Descripcion |
|------|-------------|
| `User`, `AuthUser`, `UserRole` | Usuarios y roles |
| `LoginCredentials`, `RegisterData`, `AuthResponse` | Autenticacion |
| `CreateUserData`, `UpdateUserData` | CRUD de usuarios |
| `PaginatedResult<T>` | Resultado paginado generico |
| `Fichaje`, `FichajeTask`, `Agenda` | Fichajes y agenda |
| `Empresa` | Empresa |
| `Operacion` | Operaciones |
| `AlertaPlan`, `DashboardAlert` | Alertas |
| `DashboardObjective`, `DashboardHomeResponse` | Dashboard |
| `TerminalObjectivesHeader`, `TerminalAssignmentCard` | Objetivos terminal |

### Ejemplo de uso

```typescript
// Frontend o Backend - el mismo tipo
import type { User, PaginatedResult } from '@biosstel/shared-types';

// En una lib backend, reexportar para el barrel
export type { Empresa } from '@biosstel/shared-types';
```

### Anadir un tipo nuevo

1. Definirlo en `libs/shared-types/src/index.ts`.
2. Ejecutar `pnpm build:types` para regenerar el `dist/`.
3. Importar desde `@biosstel/shared-types` en cualquier proyecto.

### Verificar tipos

```bash
# Typecheck completo de todo el monorepo
pnpm typecheck

# Solo typecheck del API
pnpm typecheck:api

# Solo typecheck del frontend
pnpm typecheck:front

# Build de shared-types (regenera dist/)
pnpm build:types

# Build completo (incluye shared-types + todas las libs + apps)
pnpm build:all
```

## 🔄 Paths y Imports

### Paths Configurados

El proyecto usa paths de TypeScript para imports limpios:

```typescript
// Backend
import { UsersModule } from '@biosstel/api-usuarios';
import { UserEntity } from '@biosstel/api-usuarios';

// Frontend
import { Button } from '@biosstel/ui';
import { AuthLayout } from '@biosstel/shared';
import { useUsers } from '@biosstel/usuarios';
import { useRouter } from '@biosstel/platform';
import type { User } from '@biosstel/shared-types';
```

### Configuración de paths y build

- **`tsconfig.base.json`**: Paths base del monorepo (todos los `@biosstel/*` apuntan a source en desarrollo).
- **Backend**
  - **`apps/api-biosstel/tsconfig.dev.json`**: Paths a archivos fuente para desarrollo (tsx watch).
  - **`apps/api-biosstel/tsconfig.build.json`**: Paths a `dist/` para build de producción.
- **Frontend**
  - Cada feature y la app usan **`tsconfig.build.json`** en build: los paths `@biosstel/ui`, `@biosstel/ui-layout`, `@biosstel/platform`, `@biosstel/shared` apuntan a **`dist/`** para evitar errores de `rootDir` en el compilador. En desarrollo se sigue usando el `tsconfig` base (source).
  - **`libs/frontend/ui`**: Build excluye `*.stories.ts(x)`; el resto de libs (ui-layout, platform, shared, features) tienen target `build` con `@nx/js:tsc`.
- **`libs/shared-types`**: Target build con `@nx/js:tsc`; se compila primero y el resto resuelve contra `dist/`.

## 🧪 Testing

### Tests Unitarios (Vitest)

```bash
# Ejecutar todos los tests
pnpm test

# Tests con UI interactiva
pnpm test:ui

# Tests específicos
pnpm test:api
pnpm test:front
```

### Tests E2E (Playwright)

```bash
# Instalar navegadores
pnpm playwright:install

# Ejecutar tests E2E
pnpm test:e2e

# Tests E2E con UI interactiva
pnpm test:e2e:ui

# Tests específicos
pnpm test:e2e:api
pnpm test:e2e:front
```

### Estructura de Tests

- **Unitarios (Vitest)**: Tests en `apps/api-biosstel/` (p. ej. `health.controller.test.ts`), `apps/front-biosstel/` y en libs con `*.test.ts(x)`. Features con tests: auth, usuarios, fichajes, alertas, empresa, operaciones, objetivos, productos, inventory, reports. Comando por feature: `pnpm test:auth`, `pnpm test:usuarios`, `pnpm test:libs`, etc.
- **E2E (Playwright)**: Proyectos `apps/e2e-api/` y `apps/e2e-front/`. Cubren: health, auth, users, fichajes, objetivos, alertas, productos, inventario, operaciones, empresa, reports, layout, login y flujos completos. Comandos: `pnpm test:e2e`, `pnpm test:e2e:api`, `pnpm test:e2e:front`. Requieren BD levantada y, para e2e-front, API y Front accesibles. Detalle: [docs/TESTING.md](docs/TESTING.md) y [docs/ESTADO_FUNCIONALIDADES_Y_TESTS.md](docs/ESTADO_FUNCIONALIDADES_Y_TESTS.md).

## ✅ Checklist pre-producción

Antes de desplegar a producción, ejecutar en orden para minimizar riesgo:

| Paso | Comando | Qué comprueba |
|------|---------|----------------|
| 1. Build | `pnpm run build` | API y Front compilan sin errores. |
| 2. Tests unitarios | `pnpm test` | Vitest en apps y libs (incl. health, slices, servicios). |
| 3. Lint | `pnpm lint` | ESLint sin errores. |
| 4. Typecheck | `pnpm typecheck` | TypeScript estricto sin errores. |
| 5. E2E (opcional) | `pnpm test:e2e` | Playwright contra API y Front (requiere servicios y BD). |

**Secuencia rápida:** `pnpm run build && pnpm test && pnpm lint && pnpm typecheck`

**Checklist ampliado** (health, config, variables de entorno, errores conocidos): [docs/CHECKLIST_PRE_PRODUCCION.md](docs/CHECKLIST_PRE_PRODUCCION.md).

## 📚 Documentación completa (docs/)

| Documento | Descripción |
|-----------|-------------|
| [CI_CD.md](docs/CI_CD.md) | Pipelines, GitHub Actions, secrets, branching. |
| [TESTING.md](docs/TESTING.md) | Cómo ejecutar unitarios y E2E, cobertura, timeouts. |
| [ESTADO_FUNCIONALIDADES_Y_TESTS.md](docs/ESTADO_FUNCIONALIDADES_Y_TESTS.md) | Estado de cada funcionalidad, tests asociados, checklist de entrega. |
| [CHECKLIST_PRE_PRODUCCION.md](docs/CHECKLIST_PRE_PRODUCCION.md) | Compilación, tests, lint, typecheck, health, errores conocidos. |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | EACCES en pnpm, `pnpm:fix-install`. |
| [CONFIG_SERVER.md](docs/CONFIG_SERVER.md) | Config por feature, `/api/v1/config`, GraphQL activable, adapters. |
| [API_RESPONSES.md](docs/API_RESPONSES.md) | Formato de respuestas de la API. |
| [API_SPECIFICATIONS_ES.md](docs/API_SPECIFICATIONS_ES.md) | Especificaciones de la API. |
| [ARQUITECTURA_DIAGRAMAS.md](docs/ARQUITECTURA_DIAGRAMAS.md) | Diagramas Mermaid (sistema, monorepo, front, back, BD). |
| [BOUNDARIES_AND_TYPES.md](docs/BOUNDARIES_AND_TYPES.md) | Boundaries Nx, ESLint, tipos compartidos. |
| [DESIGN_TOKENS_FIGMA.md](docs/DESIGN_TOKENS_FIGMA.md) | Design tokens y Figma. |
| [NX_COMANDOS.md](docs/NX_COMANDOS.md) | Generadores Nx, uso con `--no-interactive`. |
| [SENTRY_Y_FLOW_LOG.md](docs/SENTRY_Y_FLOW_LOG.md) | Sentry y log de flujo en dev. |
| [SNYK_SETUP.md](docs/SNYK_SETUP.md) | Configuración Snyk. |
| [PLAN_ENTREGA_CLIENTE.md](docs/PLAN_ENTREGA_CLIENTE.md) | Plan de implementación para entrega. |
| **mejroasaplicadas/** | Comparativa proyecto heredado vs monorepo: presentaciones HTML, informe de problemas, guion empresa. Ver [README](docs/mejroasaplicadas/README.md). |

**Scripts de package.json:** [SCRIPTS.md](SCRIPTS.md).

## 🚀 Desarrollo

### Workflow Recomendado

1. **Iniciar base de datos**:

   ```bash
   pnpm db:start
   ```

2. **Iniciar todo en desarrollo**:

   ```bash
   pnpm start
   ```

3. **Desarrollar**:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000/api
   - Swagger: http://localhost:4000/api/docs
   - Adminer: http://localhost:8080

### Live Reload

- ✅ **Frontend**: Hot reload automático con Next.js
- ✅ **Backend**: Live reload con `tsx watch` usando archivos fuente
- ✅ **Librerías**: Cambios en `libs/*` se reflejan automáticamente sin compilar

### URLs de Acceso

| Servicio     | URL                              |
| ------------ | -------------------------------- |
| Frontend     | http://localhost:3000            |
| API          | http://localhost:4000/api        |
| Swagger Docs | http://localhost:4000/api/docs   |
| Health Check | http://localhost:4000/api/health |
| Adminer (BD) | http://localhost:8080            |

## 📚 Documentación Adicional

- **Arquitectura hexagonal backend**: [plans/HEXAGONAL_ARCHITECTURE.md](plans/HEXAGONAL_ARCHITECTURE.md)
- **Arquitectura API**: [plans/arquitectura-api.md](plans/arquitectura-api.md)
- **Arquitectura Frontend**: [plans/arquitectura-front.md](plans/arquitectura-front.md)
- **Configuración TypeScript**: `apps/api-biosstel/TSCONFIG.md`

---

## 🔧 Troubleshooting

### Problemas Comunes

#### ❌ "Cannot find module '@biosstel/...'"

**Causa**: Los paths de TypeScript no están configurados correctamente o el IDE necesita reiniciarse.

**Solución**:

```bash
# 1. Reiniciar el TypeScript Language Server
# En VSCode/Cursor: Cmd/Ctrl + Shift + P → "Restart TS Server"

# 2. Verificar que las dependencias estén instaladas
pnpm install

# 3. Si persiste, limpiar y reinstalar
pnpm clean
pnpm install
```

---

#### ❌ pnpm install: EACCES permission denied (node_modules o .ignored)

**Causa**: En alguna app/lib se usó otro gestor (npm/yarn) y pnpm intenta mover esos paquetes sin permisos.

**Solución**: Limpiar todos los `node_modules` y reinstalar:

```bash
pnpm run pnpm:fix-install
```

Más detalles: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

#### ❌ "Error: connect ECONNREFUSED localhost:5434"

**Causa**: La base de datos no está corriendo.

**Solución**:

```bash
# Verificar si Docker está corriendo
docker ps

# Si no hay contenedores, iniciar la base de datos
pnpm db:start

# Verificar que el contenedor esté corriendo
docker ps | grep postgres
# Debería mostrar: biosstel-db   Up  0.0.0.0:5434->5432/tcp
```

---

#### ❌ "Error: la autentificación password falló para el usuario"

**Causa**: Las credenciales en `.env` no coinciden con las de Docker.

**Solución**:

```bash
# 1. Verificar que tu .env tenga:
#    DB_PORT=5434 (no 5432)
#    DB_PASSWORD=biosstel123

# 2. Si cambiaste las credenciales, resetear la BD
pnpm db:reset
pnpm db:start
pnpm db:seed
```

---

#### ❌ Grafana no carga (ERR_EMPTY_RESPONSE en localhost:3002)

**Causa**: El stack de monitoring no está levantado.

**Solución**:

```bash
pnpm monitoring:up
# Esperar ~1 minuto (primera vez descarga imágenes). Luego http://localhost:3002 (admin/admin)
```

---

#### ❌ "Port 5434 is already allocated"

**Causa**: Ya hay un PostgreSQL corriendo en ese puerto.

**Solución**:

```bash
# Opción 1: Detener el servicio existente
pnpm db:stop

# Opción 2: Cambiar el puerto en docker-compose.dev.yml
# En docker-compose.dev.yml cambiar el puerto del host, p. ej. "5435:5432", y en .env DB_PORT=5435
# Actualizar DB_PORT en .env
```

---

#### ❌ Live Reload no funciona en el backend

**Causa**: TypeScript está usando archivos compilados en vez de source.

**Solución**:

```bash
# Verificar que apps/api-biosstel/tsconfig.dev.json apunte a source files
# Debería tener paths como:
# "@biosstel/api-users": ["../../libs/backend/api-users/src/index.ts"]
# NO:
# "@biosstel/api-users": ["../../dist/libs/backend/api-users/index.js"]

# Reiniciar el servidor
# Ctrl+C y volver a ejecutar:
pnpm dev:api
```

---

#### ❌ "No hay alertas disponibles" en el dashboard

**Causa**: La base de datos no tiene datos de prueba.

**Solución**:

```bash
# Ejecutar seed
pnpm db:seed

# Si ya ejecutaste seed antes, resetear y volver a poblar
pnpm db:reset
pnpm db:start
pnpm db:seed
```

---

#### ❌ Frontend no se conecta al API (CORS error)

**Causa**: Configuración de CORS incorrecta.

**Solución**:

```bash
# Verificar que tu .env tenga:
CORS_ORIGIN=http://localhost:3000

# Reiniciar el API
# Ctrl+C en la terminal del API y:
pnpm dev:api
```

---

#### ❌ "Cannot execute operation on 'default' connection"

**Causa**: TypeORM no puede conectarse a la base de datos.

**Solución**:

```bash
# 1. Verificar que Docker esté corriendo
docker ps | grep postgres

# 2. Verificar variables de entorno
cat .env | grep DB_

# 3. Verificar conectividad
docker exec biosstel-postgres-dev psql -U biosstel -d biosstel -c "SELECT 1;"
# Debería devolver: 1
```

---

#### ❌ Build falla con "Cannot find module"

**Causa**: Intentas compilar sin tener las dependencias compiladas.

**Solución**:

```bash
# Nx compila las dependencias automáticamente
pnpm build

# Si quieres compilar solo una librería:
nx build api-usuarios
nx build api-objetivos
```

---

### 🆘 Último Recurso: Reset Completo

Si nada funciona, prueba esto:

```bash
# 1. Detener todo (Ctrl+C en todas las terminales)
pnpm db:stop

# 2. Limpieza + reinstalar + arrancar (un solo comando)
pnpm fresh-start
```

Eso hace: borrar `node_modules`, `dist`, `.next` y cachés → `pnpm install` → `pnpm start` (Docker). Si además quieres base de datos limpia:

```bash
pnpm db:reset
pnpm db:start
pnpm db:seed
pnpm start
```

O solo limpiar sin instalar ni arrancar: `pnpm clean`.

---

## 🔄 CI/CD

### GitHub Actions

El proyecto incluye pipelines de CI/CD en `.github/workflows/`. El principal es **`ci.yml`**: Lint, TypeCheck, Unit Tests, E2E (en main/develop), Snyk, SonarCloud y Build. Ver **[docs/CI_CD.md](docs/CI_CD.md)** para detalles, secrets y qué jobs bloquean el merge.

### Validar antes de push (mismo criterio que el CI)

```bash
pnpm run lint
pnpm run format:check
pnpm run typecheck:api
pnpm run typecheck:front
pnpm run test:coverage
pnpm run build
```

O `pnpm run validate` (lint + typecheck + test) y luego `pnpm run build`.

### Secrets necesarios para CI completo

| Secret | Uso |
|--------|-----|
| `SONAR_TOKEN` | SonarCloud (Account → Security) |
| `SNYK_TOKEN` | Snyk (Account settings → API token) |

Configuración en GitHub: **Settings → Secrets and variables → Actions**. Sin ellos, los jobs de Snyk y SonarCloud fallan; el resto del pipeline puede pasar.

## 🎯 Características Principales

### ✅ Arquitectura Modular

- Features extraíbles y reutilizables
- Librerías compartidas entre frontend y backend
- Separación clara de responsabilidades

### ✅ Live Reload Avanzado

- Backend usa archivos fuente directamente en desarrollo
- No requiere compilar librerías antes de desarrollar
- Cambios se reflejan automáticamente

### ✅ Type Safety Full-Stack

- Tipos compartidos entre frontend y backend
- Sin desincronización de tipos
- DTOs y Value Objects definidos una sola vez

### ✅ Escalabilidad

- Fácil agregar nuevas features
- Features pueden extraerse a microservicios
- Arquitectura preparada para crecimiento

## 📄 Licencia

ISC

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para preguntas o problemas, abre un issue en el repositorio.

---

## 📖 Resumen Visual

### 🎯 Flujo de Desarrollo Típico

```
┌─────────────────────────────────────────────────────────────────┐
│  1️⃣ Primera vez configurando el proyecto                        │
└─────────────────────────────────────────────────────────────────┘
   ↓
   git clone <repo>
   cd babooni
   ↓
   Opción A – Arranque rápido (recomendado):
   pnpm fresh-start    # Limpia, instala e inicia todo con Docker
   ↓
   Opción B – Paso a paso:
   pnpm install
   Crear .env con credenciales (ver sección Variables de Entorno)
   pnpm db:start       # Inicia PostgreSQL en Docker
   pnpm db:seed        # Crea usuarios y datos de prueba
   pnpm start          # Inicia Frontend + API con Docker
   ↓
   ✅ http://localhost:3000 (Frontend)
   ✅ http://localhost:4000/api (API)

┌─────────────────────────────────────────────────────────────────┐
│  2️⃣ Desarrollo día a día                                         │
└─────────────────────────────────────────────────────────────────┘
   ↓
   pnpm db:start       # Si no está corriendo (o todo ya va con Docker)
   pnpm start          # Inicia todo con Docker (Postgres, API, Frontend)
   ↓
   Desarrollar...
   - Editas libs/frontend/*/src/** → Hot reload en browser
   - Editas libs/backend/*/src/**  → Nodemon reinicia API
   ↓
   Commit y push
   ↓
   CI/CD se ejecuta automáticamente:
   - Lint
   - TypeCheck
   - Tests
   - Build

┌─────────────────────────────────────────────────────────────────┐
│  3️⃣ Antes de producción                                         │
└─────────────────────────────────────────────────────────────────┘
   ↓
   pnpm run build && pnpm test && pnpm lint && pnpm typecheck
   ↓
   Opcional: pnpm test:e2e (con BD y servicios levantados)
   ↓
   Ver Checklist pre-producción y docs/CHECKLIST_PRE_PRODUCCION.md

┌─────────────────────────────────────────────────────────────────┐
│  4️⃣ Si algo no funciona                                          │
└─────────────────────────────────────────────────────────────────┘
   ↓
   Ver sección 🔧 Troubleshooting arriba
   ↓
   Si nada funciona: Reset completo
   - pnpm db:stop
   - pnpm fresh-start   # (opcional: pnpm db:reset && pnpm db:start && pnpm db:seed y luego pnpm start)
```

### 🏗️ Arquitectura Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│                      http://localhost:3000                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages         Components        Data Access        Layouts     │
│  ------        ----------        -----------        -------     │
│  /login   →    LoginForm    →    useLogin()   →    AuthLayout  │
│  /home    →    Dashboard    →    useDashboard() →  MainLayout  │
│                     ↓                ↓                           │
│              @biosstel/ui    @biosstel/platform                 │
│              @biosstel/ui-layout                                │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP (fetch)
┌─────────────────────────────────────────────────────────────────┐
│                      API REST (NestJS)                           │
│                   http://localhost:4000/api                      │
├─────────────────────────────────────────────────────────────────┤
│  Controllers         Services          Repositories             │
│  -----------         --------          ------------             │
│  UsersController → UsersService → TypeOrmUserRepository         │
│  DashboardCtrl   → DashboardSvc → TypeOrmDashboardRepo          │
│                         ↓                                        │
│                   TypeORM Entities                              │
│              (UserEntity, DashboardEntity, etc.)                │
└─────────────────────────────────────────────────────────────────┘
                              ↕ SQL
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL (Docker)                             │
│                   localhost:5434                                 │
├─────────────────────────────────────────────────────────────────┤
│  Tables: users, clients, dashboard_objectives, dashboard_alerts, │
│  terminal_objectives, terminal_assignments, departments,         │
│  work_centers, products, inventory_items, fichajes, tasks, etc.  │
│  Seed: usuarios, clientes, objetivos, alertas, empresa,         │
│  productos, inventario, fichajes, tareas (ver sección Seed).     │
└─────────────────────────────────────────────────────────────────┘
```

### 📦 Estructura de Carpetas Simplificada

```
babooni/
│
├── apps/                                # Aplicaciones ejecutables
│   ├── front-biosstel/                  # Next.js 16 (puerto 3000)
│   │   ├── src/app/[locale]/            # App Router + i18n (next-intl)
│   │   ├── src/store/, i18n/            # Redux, configuración i18n
│   │   └── public/
│   │
│   └── api-biosstel/                    # NestJS (puerto 4000)
│       ├── src/
│       ├── dev.ts                       # Entry point desarrollo (tsx watch)
│       ├── seed.ts                      # 🌱 Seed
│       ├── tsconfig.dev.json
│       └── tsconfig.build.json
│
├── libs/
│   ├── frontend/                        # Librerías frontend
│   │   ├── features/                    # auth, usuarios, objetivos, fichajes, operaciones, empresa, alertas
│   │   ├── ui/                          # Componentes atómicos + Storybook
│   │   ├── ui-layout/                   # PageContainer, SidebarLayout
│   │   ├── shared/                      # AuthLayout, PageContent
│   │   └── platform/                    # useRouter, Link (next-intl)
│   │
│   ├── backend/                         # api-auth, api-usuarios, api-objetivos, api-fichajes, api-alertas, api-operaciones, api-empresa, api-productos, api-shared
│   │
│   └── shared-types/                    # 🔗 Tipos compartidos
│
├── scripts/                             # clean.js, ensure-docker.js
├── plans/                               # Documentación arquitectura
├── .env
├── docker-compose.dev.yml
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
```

---

## ✨ Características Destacadas

| Característica              | Descripción                                  |
| --------------------------- | -------------------------------------------- |
| 🏗️ **Arquitectura Modular** | Features extraíbles, librerías reutilizables |
| 🔥 **Live Reload Completo** | Backend + Frontend con hot reload            |
| 🎯 **Type Safety**          | Tipos compartidos entre frontend y backend   |
| 🧪 **Testing Integrado**    | Vitest + Playwright configurados             |
| 🐳 **Docker Ready**         | Base de datos en contenedor                  |
| 🔐 **Auth JWT**             | Autenticación con Passport + JWT             |
| 🌐 **i18n**                 | Soporte multiidioma (ES, EN)                 |
| 📊 **Dashboard**            | Objetivos, alertas, objetivos terminales (contratos/puntos e histórico) |
| 👥 **Usuarios y clientes**  | CRUD usuarios, alta de clientes, documentos  |
| 🏢 **Empresa**              | Departamentos y centros de trabajo            |
| 📦 **Productos e inventario** | Catálogo, inventario, plantilla CSV, informes |
| ⏱️ **Fichajes y tareas**   | Entrada/salida, pausas, tareas por usuario   |
| 🚀 **CI/CD**                | GitHub Actions configurado                    |
| 📖 **API Docs**             | Swagger UI en `/api/docs`                     |
| ⚙️ **Config Server**        | `/api/v1/config`, adapters por feature, GraphQL activable por config |
| ✅ **Pre-producción**       | [CHECKLIST_PRE_PRODUCCION.md](docs/CHECKLIST_PRE_PRODUCCION.md) para build, test, lint, typecheck |

---

## 🚀 CI/CD Pipeline

### Estrategia de Branching

```
main (production) ──────────────────────────────────────────►
  ↑
release/* (staging) ────────────────────────────────────────►
  ↑
develop (integration) ──────────────────────────────────────►
  ↑
feature/* (development) ────────────────────────────────────►
```

### Flujos Automatizados

| Rama        | Trigger | Acciones                  | Deploy        |
| ----------- | ------- | ------------------------- | ------------- |
| `main`      | Push    | Lint + Test + Build + E2E | ✅ Production |
| `release/*` | Push    | Lint + Test + Build       | ✅ Staging    |
| `develop`   | Push    | Lint + Test + Build       | ❌ No deploy  |
| `feature/*` | PR      | Lint + Test               | ❌ No deploy  |

### GitHub Actions Workflows

1. **`ci.yml`** - Pipeline principal
   - ✅ Lint (ESLint + TypeScript)
   - ✅ Tests unitarios (Vitest)
   - ✅ Tests E2E (Playwright)
   - ✅ Build (Frontend + Backend)

2. **`cd.yml`** - Deployment
   - 🐳 Build Docker images
   - 🚀 Deploy to environment
   - 🏷️ Create release tags (solo `main`)

3. **`pr-checks.yml`** - PR automation
   - 📋 PR information
   - 🔍 Detect changed files
   - 📊 Bundle size check

### Configuración Branch Protection

Ver documentación completa en [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md)

**Resumen:**

- **`main`**: 2 approvals + todos los checks + no force push
- **`release/*`**: 1 approval + checks + no force push
- **`develop`**: 1 approval + checks básicos
- **`feature/*`**: 1 approval + lint

### CODEOWNERS

Revisores automáticos configurados por área:

- **Frontend**: `@frontend-team`
- **Backend**: `@backend-team`
- **DevOps**: `@devops-team`
- **Global**: `@tech-lead`

Ver [`.github/CODEOWNERS`](.github/CODEOWNERS)

### Dependabot

Actualizaciones automáticas semanales:

- 📦 npm packages (agrupados por framework)
- 🐳 Docker base images
- ⚙️ GitHub Actions

---

## 🔮 Próximos Pasos (Roadmap)

Para mejorar la robustez y la experiencia de desarrollo, se planea integrar las siguientes herramientas:

### 🛡️ Monitoreo de Errores (Sentry)

Integración futura con **Sentry** para tracking de errores en tiempo real:

- **Frontend**: Captura de excepciones no controladas en React, performance tracing (Web Vitals).
- **Backend**: Captura de excepciones en NestJS, tracking de transacciones HTTP/DB.
- **Replay**: Grabación de sesiones de usuario (con privacidad) para depuración visual.

### 🎭 Mock Server (MSW)

Implementación de **Mock Service Worker (MSW)** o servidor de mocks similar para:

- **Desarrollo Offline**: Poder desarrollar el frontend sin depender del backend local.
- **Tests Deterministas**: Tests E2E y de integración más rápidos y estables sin depender de una BD real.
- **Simulación de Casos Borde**: Probar errores 500, latencia de red, etc., difícil de reproducir con el backend real.

---
