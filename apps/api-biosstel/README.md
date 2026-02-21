# API Biosstel

API REST del monorepo: **NestJS** con **TypeORM** y **PostgreSQL**. Ejecuta en el puerto **4000**. Autenticación con **JWT** (Passport).

---

## Índice

| Sección | Contenido |
|--------|-----------|
| [Stack y estructura](#stack-y-estructura) | Tecnologías y carpetas |
| [Arquitectura](#arquitectura) | Hexagonal, módulos api-* |
| [Base de datos](#base-de-datos) | PostgreSQL, tablas, seed |
| [Endpoints](#endpoints) | REST por dominio |
| [Variables de entorno](#variables-de-entorno) | DB, JWT, CORS |
| [Comandos](#comandos) | dev, build, seed |

---

## Stack y estructura

| Tecnología | Uso |
|------------|-----|
| NestJS | Framework API REST |
| TypeORM | ORM, entidades, migraciones (synchronize en dev) |
| PostgreSQL | Base de datos |
| Passport + JWT | Autenticación |
| class-validator / class-transformer | DTOs y validación |

Estructura:

```
apps/api-biosstel/
├── src/
│   ├── app.module.ts        # Importa módulos de libs/backend
│   ├── main.ts
│   ├── dev.ts               # Entry desarrollo (tsx watch)
│   └── ...
├── seed.ts                  # Script de seed (TypeORM)
├── tsconfig.dev.json        # Paths a source (desarrollo)
├── tsconfig.build.json      # Paths a dist (build)
└── README.md
```

La lógica de negocio y persistencia vive en **libs/backend/api-***; la app solo monta los módulos NestJS.

---

## Arquitectura

Cada dominio (auth, usuarios, objetivos, fichajes, etc.) es una **lib** con arquitectura hexagonal:

```text
libs/backend/api-usuarios/
├── application/     # Puertos (input/output), use cases
├── infrastructure/
│   ├── api/         # Controladores REST
│   └── persistence/ # Entidades TypeORM, repositorios
└── index.ts
```

La API (`api-biosstel`) importa estos módulos y los registra en `AppModule`. Flujo:

```text
HTTP Request
    → Controller (infrastructure/api)
    → Port (application)
    → Use Case
    → Repository (infrastructure/persistence)
    → TypeORM → PostgreSQL
```

Diagramas: [docs/ARQUITECTURA_DIAGRAMAS.md](../../docs/ARQUITECTURA_DIAGRAMAS.md).

---

## Base de datos

### Tecnología y acceso

- **Motor**: PostgreSQL.
- **ORM**: TypeORM (entidades en cada lib `api-*/infrastructure/persistence/`).
- **Desarrollo**: Con Docker, Postgres expuesto en el puerto **5434** (no 5432) para evitar conflicto con una instalación local.

### Variables de entorno (por defecto)

| Variable | Valor | Descripción |
|----------|--------|-------------|
| DB_HOST | localhost | Servidor |
| DB_PORT | 5434 | Puerto (Docker dev) |
| DB_USER | biosstel | Usuario |
| DB_PASSWORD | biosstel123 | Contraseña |
| DB_NAME | biosstel | Base de datos |

### Tablas principales

| Tabla | Lib | Descripción |
|-------|-----|-------------|
| users | api-usuarios | Usuarios de la app |
| clients | api-usuarios | Clientes (CRM) |
| user_documents | api-usuarios | Documentos por usuario |
| departments | api-empresa | Departamentos |
| work_centers | api-empresa | Centros de trabajo |
| fichajes | api-fichajes | Registros de jornada |
| tasks | api-fichajes | Tareas por usuario |
| terminal_objectives | api-objetivos | Objetivos terminales |
| terminal_assignments | api-objetivos | Asignaciones por objetivo |
| products | api-productos | Catálogo de productos |
| inventory_items | api-productos | Inventario |
| dashboard_objectives | api-objetivos | Objetivos del dashboard |
| dashboard_alerts | api-objetivos | Alertas del dashboard |

Modelo detallado (ER): [docs/ARQUITECTURA_DIAGRAMAS.md#5-base-de-datos](../../docs/ARQUITECTURA_DIAGRAMAS.md#5-base-de-datos-postgresql--modelo-entidad-relación).

### Seed (datos de prueba)

- **Comando** (desde la raíz del monorepo): `pnpm db:seed`
- **Script Node**: `apps/api-biosstel/seed.ts` (usa TypeORM y entidades).
- **SQL alternativo**: `docker/seed.sql` (se puede ejecutar contra el contenedor).

El seed crea usuarios (admin, coordinador, telemarketing, etc.), objetivos, alertas, fichajes, empresa, productos, inventario y datos relacionados. Es idempotente (no duplica si ya existen).

### Docker (recomendado)

```bash
# Solo BD + Adminer
pnpm db:start

# Poblar
pnpm db:seed

# Reset completo (borra volúmenes)
pnpm db:reset
```

**Adminer**: http://localhost:8080 (Sistema: PostgreSQL, Servidor: host.docker.internal o `postgres`, Puerto: 5432 dentro del contenedor / 5434 en host, Usuario: biosstel, Contraseña: biosstel123).

---

## Endpoints

Base URL: **http://localhost:4000/api/v1**

Documentación interactiva: **http://localhost:4000/api/docs** (Swagger).

### Por dominio

| Dominio | Ejemplos | Auth |
|---------|-----------|------|
| Auth | POST /auth/login, GET /auth/me, POST /auth/forgot-password | Login público; resto JWT |
| Usuarios | GET/POST /users, GET/PUT /users/:id, GET/POST /users/:userId/documents | JWT |
| Clientes | GET/POST /clients | JWT |
| Dashboard | GET /dashboard/home, GET /dashboard/terminal-objectives, PATCH /dashboard/terminal-objectives/:id | JWT |
| Empresa | GET /empresa, GET/POST/PUT /empresa/departments, /empresa/work-centers | JWT |
| Fichajes | GET /fichajes, POST /fichajes/clock-in, POST /fichajes/:id/clock-out, pause, resume | JWT |
| Tareas | GET /tasks/user/:userId, POST/PATCH/DELETE /tasks, /tasks/:id | JWT |
| Productos | GET/POST /productos, GET/PATCH/DELETE /productos/:id | JWT |
| Inventario | GET /inventory, GET/POST/PATCH/DELETE /inventory/:id | JWT |
| Informes | GET /reports/summary | JWT |
| Alertas | GET /alertas | JWT |
| Operaciones | GET /operaciones | JWT |

La mayoría de rutas requieren cabecera: `Authorization: Bearer <token>` (token obtenido con POST /auth/login).

---

## Variables de entorno

En la **raíz del monorepo** (o donde se ejecute la API):

```env
# Base de datos
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

# CORS (origen del frontend)
CORS_ORIGIN=http://localhost:3000
```

---

## Comandos

Desde la **raíz del monorepo**:

| Comando | Descripción |
|---------|-------------|
| `pnpm db:start` | Levanta Postgres + Adminer (requerido para API local) |
| `pnpm dev:api` | API en desarrollo (puerto 4000, live reload con tsx) |
| `pnpm build:api` | Build de producción de la API |
| `pnpm db:seed` | Pobla la BD (ejecutar con BD levantada) |
| `pnpm start` | Levanta todo el stack (Docker: DB + API + Frontend) |

Para desarrollo solo API: primero `pnpm db:start`, luego `pnpm dev:api`.

---

## Documentación relacionada

- [README principal del monorepo](../../README.md)
- [Diagramas de arquitectura](../../docs/ARQUITECTURA_DIAGRAMAS.md)
- [Arquitectura hexagonal](../../plans/HEXAGONAL_ARCHITECTURE.md)
- [Apps (resumen)](../README.md)
