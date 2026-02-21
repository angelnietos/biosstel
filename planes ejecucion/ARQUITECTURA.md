# Arquitectura – Biosstel

Documento de arquitectura del sistema: monorepo, API, frontend, base de datos, autenticación y despliegue.

---

## 1. Visión general

- **Monorepo** (pnpm + Nx): aplicaciones `apps/` y librerías compartidas `libs/`.
- **API:** NestJS (Node), TypeORM, PostgreSQL. Servicio único `api-biosstel` que agrega módulos por dominio.
- **Frontend:** Next.js (App Router), React, Redux. App `front-biosstel` que consume libs de features (`@biosstel/objetivos`, `@biosstel/fichajes`, etc.) y shell de rutas.
- **Autenticación:** JWT (login en API, token en localStorage; restauración desde JWT en front). Roles en payload y en store para control de UI (admin no ficha, etc.).

---

## 2. Estructura del monorepo

```
babooni/
├── apps/
│   ├── api-biosstel/          # API NestJS (puerto configurable, ej. 3001)
│   ├── front-biosstel/        # Next.js (puerto 3000)
│   └── e2e-* / storybook     # Tests E2E, Storybook
├── libs/
│   ├── backend/              # Módulos API por dominio
│   │   ├── api-auth/
│   │   ├── api-usuarios/
│   │   ├── api-fichajes/
│   │   ├── api-objetivos/
│   │   ├── api-alertas/
│   │   ├── api-productos/
│   │   ├── api-operaciones/
│   │   ├── api-empresa/
│   │   └── api-shared/
│   └── frontend/              # Features y shared del front
│       ├── shell/             # Rutas, layout, routeRegistry
│       ├── features/          # auth, objetivos, fichajes, usuarios, alertas, productos, etc.
│       ├── shared/            # Componentes UI compartidos, Sidebar, Layout
│       ├── platform/          # Constantes, rutas, roles, canFichar, canManageFichajes
│       ├── ui/                # Design system (botones, tablas, modales)
│       └── ui-layout/         # PageContainer, Stack, etc.
├── docker/                    # init-db.sql, compose
├── figma / figma2/            # Diseños Figma origen
├── figma designs/              # Flujo completo y índice Figma
└── planes ejecucion/          # Planes de ejecución (este conjunto de docs)
```

---

## 3. API (Backend)

### 3.1 Stack

- **Runtime:** Node.js
- **Framework:** NestJS 11
- **ORM:** TypeORM (PostgreSQL)
- **Auth:** JWT (Passport), estrategia en `api-auth`
- **Config:** ConfigModule (env), LoggerModule (pino)
- **Monitoring:** Terminus (health), Prometheus (métricas en `/api/metrics`)

### 3.2 Módulos y responsabilidades

| Módulo | Ruta base | Responsabilidad |
|--------|-----------|-----------------|
| api-auth | `/auth` | Login, /me, forgot-password |
| api-usuarios | `/users` | CRUD usuarios |
| api-fichajes | `/fichajes`, `/tasks` | Clock-in/out, pause/resume, tareas por usuario |
| api-objetivos | `/dashboard` | home, terminal-objectives (objetivos y alertas dashboard) |
| api-alertas | `/alertas` | Listado alertas (usa entidades dashboard) |
| api-productos | `/productos`, `/inventory` | CRUD productos e inventario |
| api-operaciones | `/operaciones` | Landing operaciones |
| api-empresa | `/empresa` | Datos empresa |

### 3.3 Base de datos (TypeORM + PostgreSQL)

- **Conexión:** config vía env (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).
- **Schemas:** `auth_schema`, `app_schema` creados en `docker/init-db.sql`; tablas en `public` para compatibilidad con script init y TypeORM.
- **Sincronización:** `synchronize: true` en desarrollo; en producción se deben usar migraciones.
- **Entidades actuales:** users, dashboard_objectives, dashboard_alerts, terminal_objectives, terminal_assignments, fichajes, tasks, agendas, products, inventory_items (ver PLAN_BASE_DE_DATOS.md para esquemas y pendientes).

### 3.4 Autenticación API

- Login: POST `/auth/login` → JWT con payload (sub, email, name, role si el backend lo envía).
- Ruta protegida: GET `/auth/me` con Bearer token.
- Guards NestJS para proteger controladores que requieran usuario/rol.

---

## 4. Frontend

### 4.1 Stack

- **Framework:** Next.js (App Router)
- **UI:** React, Redux (auth state, fichajes state, etc.)
- **Rutas:** Shell (`libs/frontend/shell`) con `routeRegistry.tsx`: path → lazy load del feature. Locale en URL (ej. `/es/home`, `/en/fichajes`).
- **Design system:** `@biosstel/ui` (Button, Card, Table, Modal, Skeleton, etc.), `@biosstel/ui-layout` (PageContainer, Stack).

### 4.2 Flujo de rutas y permisos

- **routeRegistry:** MAIN_ROUTES (home, fichajes, objetivos, productos, alertas, operaciones, empresa, etc.), ADMIN_ROUTES (users, add-user, add-client, users/:id, documentacion), AUTH_ROUTES (login, forgot-password, email-send, verify-account, registro-salida).
- **Permisos por ruta:** `libs/frontend/platform/src/config/routesPermissions.ts` define qué roles pueden acceder a cada path (prefix o exact). `canAccessPath(path, role)` usado en shell/layout para mostrar u ocultar enlaces.
- **Elementos por rol dentro de una pantalla:** `canFichar(role)`, `canManageFichajes(role)` (platform/constants/roles). Admin no ve "Fichar entrada"; solo ADMIN/COORDINADOR ven botones Añadir Calendario / Crear horario / Crear permiso.

### 4.3 Auth en frontend

- **Login:** useLogin → POST `/auth/login` → setCredentials(user, token). Redirección según return path.
- **Restauración:** AuthRestore lee JWT de localStorage, decodifica y rellena user (y role) en Redux; marca `authRestored` para evitar flash de UI según rol.
- **Protección de rutas:** ProtectedRoute o equivalente que redirige a login si no hay token/user.

### 4.4 Features y rutas principales

- **objetivos:** DashboardHomePage (Inicio), TerminalObjectivesPage, Niveles, AsignacionPersonas, etc.
- **fichajes:** FichajeDashboard, ControlJornada, Horarios, CalendarioLaboral, Permisos, FichajeManual, Geolocalizacion; PendingTasksPage, RegisterTasksPage.
- **usuarios:** UsersDashboard, UserList, AddUserForm, DetalleUsuario, Documentacion, ConfiguracionPerfil, AddClientForm.
- **alertas:** AlertasShell, AlertasVentas, Recordatorios, TrackingAlerts.
- **productos:** ProductosPage, NuevoProductoPage, InventoryPage.
- **operaciones:** OperacionesShell, ComercialVisitas, TelemarketingAgenda, BackofficeRevision, TiendaVentas.
- **empresa:** EmpresaShell, Departamentos, CentrosTrabajo, CuentasContables.

---

## 5. Comunicación API – Frontend

- **Base URL:** configurada en platform (API_BASE_URL), env en front.
- **Headers:** getAuthHeaders() añade `Authorization: Bearer <token>`.
- **Manejo de errores:** ApiErrorHandler u otro mecanismo para 401 (logout / redirigir a login).

---

## 6. Despliegue y entornos

- **Desarrollo local:** `pnpm start` (Docker: postgres, api, frontend) o `pnpm start:local` (nx dev api + front). DB init con `docker/init-db.sql`; seed con `scripts/db-seed.js` si aplica.
- **Docker:** docker-compose.dev.yml (y docker-compose para prod) en raíz. Servicios: postgres, adminer, api, frontend.

---

## 7. Criterios de diseño (Figma)

- Títulos: Heading level 1, gray-900.
- Cards: border-card, rounded-xl, shadow-sm.
- Tablas: cabecera bg-table-header; texto gray-900 / muted.
- Botones: padding suficiente (px-5, min-h-43px), whitespace-nowrap donde aplique.
- Roles: admin/coordinador no fican; solo ellos ven gestión de calendarios/horarios/permisos en Fichajes.

---

*Documento vivo: actualizar al añadir módulos, rutas o cambios de arquitectura.*
