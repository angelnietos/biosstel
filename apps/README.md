# Aplicaciones del monorepo Biosstel

Este directorio contiene las **aplicaciones ejecutables** del proyecto: frontend (Next.js) y API (NestJS). La base de datos (PostgreSQL) se ejecuta en Docker y es compartida por la API.

---

## Resumen

| Aplicación        | Tecnología      | Puerto | Descripción                          |
|-------------------|-----------------|--------|--------------------------------------|
| **front-biosstel**| Next.js 16 + React 19 | 3000 | SPA con App Router, i18n (next-intl), Redux |
| **api-biosstel**  | NestJS + TypeORM| 4000  | API REST, autenticación JWT, PostgreSQL |

---

## Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────────┐
│  front-biosstel (Next.js)          http://localhost:3000        │
│  - Shell (rutas, layout, store global)                           │
│  - Features: auth, usuarios, objetivos, fichajes, empresa,       │
│    alertas, productos, inventory, reports, operaciones            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP REST (fetch)
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  api-biosstel (NestJS)            http://localhost:4000/api      │
│  - Módulos: auth, usuarios, objetivos, fichajes, empresa,        │
│    productos, alertas, operaciones                               │
│  - Swagger: /api/docs                                             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ TypeORM
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  PostgreSQL (Docker)              localhost:5434                 │
│  - Tablas: users, clients, fichajes, tasks, products,            │
│    inventory_items, terminal_objectives, departments, etc.       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cómo arrancar

Desde la **raíz del monorepo**:

```bash
# Todo el stack (Docker: Postgres + Adminer + API + Frontend)
pnpm start

# Solo base de datos (para desarrollo local de API o Front)
pnpm db:start
pnpm dev:api    # o pnpm dev:front
```

---

## Documentación por aplicación

- **[front-biosstel/README.md](front-biosstel/README.md)** – Frontend: estructura, rutas, estado Redux, features.
- **[api-biosstel/README.md](api-biosstel/README.md)** – API: módulos, base de datos, endpoints, seed.

---

## Diagramas de arquitectura

Diagramas detallados (sistema, frontend, backend, base de datos, flujos):

- **[docs/ARQUITECTURA_DIAGRAMAS.md](../docs/ARQUITECTURA_DIAGRAMAS.md)**
