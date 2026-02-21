# Plan API – Biosstel

Inventario de endpoints actuales, endpoints faltantes por flujo y criterios de contrato y seguridad.

---

## 1. Endpoints actuales por módulo

### 1.1 Auth (api-auth)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Login; devuelve token y user (incluir role si aplica). |
| GET | `/auth/me` | Usuario actual (protegido). |
| POST | `/auth/forgot-password` | Recuperación contraseña. |

### 1.2 Usuarios (api-usuarios)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listado (paginación/filtros si aplica). |
| GET | `/users/:id` | Detalle usuario. |
| POST | `/users` | Crear usuario. |
| PUT | `/users/:id` | Actualizar usuario. |
| DELETE | `/users/:id` | Eliminar (o desactivar). |

### 1.3 Fichajes (api-fichajes)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/fichajes` | Listado (todos o por filtro). |
| GET | `/fichajes/user/:userId` | Fichajes de un usuario. |
| GET | `/fichajes/current` | Fichaje actual (por usuario del token). |
| POST | `/fichajes/clock-in` | Fichar entrada. |
| POST | `/fichajes/:fichajeId/clock-out` | Fichar salida. |
| POST | `/fichajes/:fichajeId/pause` | Pausar jornada. |
| POST | `/fichajes/:fichajeId/resume` | Retomar jornada. |

### 1.4 Tasks (api-fichajes)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tasks/user/:userId` | Tareas de un usuario. |
| GET | `/tasks/:taskId` | Detalle tarea. |
| POST | `/tasks` | Crear tarea. |
| PATCH | `/tasks/:taskId` | Actualizar (ej. completar). |
| DELETE | `/tasks/:taskId` | Eliminar tarea. |

### 1.5 Dashboard / Objetivos (api-objetivos)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/dashboard/home` | Datos home (objetivos tarjeta, etc.). |
| GET | `/dashboard/terminal-objectives` | Objetivos terminales y asignaciones. |

### 1.6 Alertas (api-alertas)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/alertas` | Listado alertas (filtros si aplican). |

### 1.7 Productos e inventario (api-productos)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos` | Listado productos. |
| GET | `/productos/:id` | Detalle producto. |
| POST | `/productos` | Crear producto. |
| PATCH | `/productos/:id` | Actualizar producto. |
| DELETE | `/productos/:id` | Eliminar producto. |
| GET | `/inventory` | Listado inventario. |
| GET | `/inventory/:id` | Detalle item inventario. |
| POST | `/inventory` | Crear item. |
| PATCH | `/inventory/:id` | Actualizar. |
| DELETE | `/inventory/:id` | Eliminar. |
| GET | `/reports/summary` | Resumen reportes. |

### 1.8 Operaciones y empresa

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/operaciones` | Landing operaciones. |
| GET | `/empresa` | Datos empresa. |

---

## 2. Endpoints faltantes (por flujo)

### 2.1 Usuario/as

| Flujo | Endpoint propuesto | Notas |
|-------|--------------------|-------|
| Añadir Departamento | POST `/departments` o POST `/empresa/departments` | CRUD departamentos. |
| Listar departamentos | GET `/departments` | Para dropdowns y filtros. |
| Centros de trabajo | GET/POST/PUT/DELETE `/work-centers` (o bajo `/empresa`) | Para filtros y tags usuario. |
| Asignar centros a usuario | PUT `/users/:id` con workCenterIds o POST `/users/:id/work-centers` | Según modelo de datos. |
| Detalle usuario – documentación | GET `/users/:id/documents` | Listar documentos. |
| Subir documento | POST `/users/:id/documents` (multipart) | Añadir documentación. |
| Descargar/eliminar documento | GET/DELETE `/users/:id/documents/:docId` | Ver y eliminar. |

### 2.2 Fichajes (calendarios, horarios, permisos)

| Flujo | Endpoint propuesto | Notas |
|-------|--------------------|-------|
| Listado calendarios laborales | GET `/work-calendars` | Para tab y modal. |
| Crear calendario | POST `/work-calendars` | Modal Crear calendario. |
| Listado horarios laborales | GET `/work-schedules` | Listado consultivo. |
| Crear horario | POST `/work-schedules` | Modal Nuevo Horario laboral. |
| Listado permisos | GET `/leave-permission-types` (o `/permissions`) | Tabs/listado. |
| Crear permiso | POST `/leave-permission-types` | Modal Nuevo Permiso. |
| Asignar calendario/horario a usuario | POST/ PUT en usuario o en recurso (ej. `users/:id/calendar`) | Según modelo. |

### 2.3 Objetivos Terminales

| Flujo | Endpoint propuesto | Notas |
|-------|--------------------|-------|
| Desactivar objetivo | PATCH `/dashboard/terminal-objectives/:id` con { isActive: false } o POST `.../deactivate` | Modal Desactivar. |
| Activar objetivo | PATCH con isActive: true | Objetivo inactivo/histórico. |
| Crear/editar objetivo terminal | POST/PUT en terminal-objectives si no existen | Nuevo objetivo +. |

### 2.4 Dashboard / Inicio

| Flujo | Endpoint propuesto | Notas |
|-------|--------------------|-------|
| Filtros (marca, departamento, etc.) | GET `/dashboard/home?marca=...&departamento=...` o ya incluido en GET `/dashboard/home` | Parámetros query. |
| Alertas con filtros | GET `/alertas?departamento=...&fecha=...` | Página alertas y tabla Inicio. |

### 2.5 Productos

| Flujo | Endpoint propuesto | Notas |
|-------|--------------------|-------|
| Asignaciones departamento (nuevo producto) | Incluir en POST/PATCH `/productos` o POST `/productos/:id/departments` | Según modelo. |
| Subir plantilla | POST `/productos/:id/upload-template` o multipart en crear producto | Modal Subir plantilla. |

---

## 3. Contratos y convenciones

- **Autenticación:** Rutas que requieran usuario: header `Authorization: Bearer <token>`. Respuesta 401 si token inválido o expirado.
- **Roles:** Donde aplique, el backend puede validar rol (ej. solo ADMIN/COORDINADOR para crear departamentos o calendarios). Documentar en cada endpoint.
- **Respuestas:** Formato consistente (ej. `{ data: T }` o directamente el recurso). Errores: código HTTP + mensaje o código de error.
- **Paginación:** Listados: query `page`, `limit` o `offset`; respuesta con `items` y `total` (o equivalente).

---

## 4. Checklist de implementación API

- [ ] Login y /me devuelven `user.role` para uso en front.
- [ ] CRUD departamentos (y centros de trabajo si aplica) implementado y documentado.
- [ ] Endpoints documentación usuario (listar, subir, eliminar) implementados.
- [ ] CRUD calendarios laborales, horarios laborales y tipos de permiso implementados.
- [ ] Filtros en GET `/dashboard/home` y GET `/alertas` (query params) si aplica.
- [ ] Desactivar/activar objetivo terminal (PATCH o endpoint específico).
- [ ] Subir plantilla producto (endpoint o multipart) si aplica.
- [ ] Tests (unit o integración) para endpoints críticos: login, fichajes, usuarios.

---

## 5. Referencias

- Controladores: `libs/backend/api-*/src/infrastructure/api/*.controller.ts`.
- App module: `apps/api-biosstel/src/app.module.ts`.
