# Biosstel API – Endpoints (Swagger)

Todos los endpoints están documentados en **Swagger** al levantar la API: `http://localhost:4000/api/docs`.

Prefijo base: `http://localhost:4000/api/v1` (salvo `health` y `metrics` que usan el mismo prefijo `/api/v1`; metrics es sin versión: `/api/metrics`).

---

## Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/health/live` | Liveness (K8s) |
| GET | `/api/v1/health/ready` | Readiness (DB accesible) |
| GET | `/api/v1/health` | Health completo (DB, memoria, disco) |

---

## Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Login (email + password). Devuelve `access_token` y `user`. |
| GET | `/api/v1/auth/me` | Usuario actual (cabecera `Authorization: Bearer <token>`). |
| POST | `/api/v1/auth/forgot-password` | Recuperar contraseña (body: `{ "email": "..." }`). |

---

## Users

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/users` | Listar usuarios (query: `page`, `pageSize`). |
| GET | `/api/v1/users/:id` | Obtener usuario por ID. |
| POST | `/api/v1/users` | Crear usuario. |
| PUT | `/api/v1/users/:id` | Actualizar usuario. |
| DELETE | `/api/v1/users/:id` | Eliminar usuario (soft delete). |

---

## Fichajes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/fichajes` | Dashboard de fichajes (query: `date`). |
| GET | `/api/v1/fichajes/user/:userId` | Fichajes por usuario. |
| GET | `/api/v1/fichajes/current` | Fichaje actual sin cerrar (query: `userId`). |
| POST | `/api/v1/fichajes/clock-in` | Fichar entrada (body: `userId`, opcional `location`). |
| POST | `/api/v1/fichajes/:fichajeId/clock-out` | Fichar salida. |
| POST | `/api/v1/fichajes/:fichajeId/pause` | Pausar jornada (body opcional: `reason`). |
| POST | `/api/v1/fichajes/:fichajeId/resume` | Reanudar jornada. |

---

## Tasks (agenda / tareas)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/tasks/user/:userId` | Tareas por usuario. |
| GET | `/api/v1/tasks/:taskId` | Obtener tarea por ID. |
| POST | `/api/v1/tasks` | Crear tarea (body: `userId`, `title`, opcional `description`). |
| PATCH | `/api/v1/tasks/:taskId` | Actualizar tarea (`title`, `description`, `completed`). |
| DELETE | `/api/v1/tasks/:taskId` | Eliminar tarea. |

---

## Objetivos / Dashboard

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/dashboard/home` | Dashboard principal (objetivos + alertas). Query: filtros opcionales. |
| GET | `/api/v1/dashboard/terminal-objectives` | Objetivos terminales (cabecera + tarjetas departamentos/personas). Query: `type=contratos|puntos`, `period=YYYY-MM`. |
| PATCH | `/api/v1/dashboard/terminal-objectives/:id` | Actualizar objetivo terminal (body: `isActive`, `achieved`, `objective`, `pct`). |
| POST | `/api/v1/dashboard/terminal-objectives/:id/assignments` | Añadir asignación (body: `groupType`, `groupTitle`, opcional `label`, `sortOrder`). |
| DELETE | `/api/v1/dashboard/terminal-objectives/:objectiveId/assignments/:assignmentId` | Eliminar asignación. |

---

## Alertas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/alertas` | Listar alertas. |

---

## Operaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/operaciones` | Listar operaciones. |

---

## Empresa

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/empresa` | Datos de empresa, centros, departamentos. |

---

## Dev-logs (solo desarrollo)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/dev-logs` | Exportar log de flujo del frontend a la BD. Body: `{ "entries": [...] }`. Solo activo si `NODE_ENV=development`; en producción responde 403. Opcional: cabecera `Authorization: Bearer <token>` para asociar el export al usuario. Crea una fila en la tabla `frontend_logs` (id, payload, userId, createdAt). |

---

## Monitoring

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/metrics` | Métricas Prometheus (sin versión en la URL). |

---

**Notas**

- Autenticación: tras `POST /auth/login`, usar el `access_token` en la cabecera `Authorization: Bearer <token>` para `GET /auth/me` y, cuando se implemente, para rutas protegidas.
- La especificación completa del compañero (departments, work-centers, brands, families, products, objectives CRUD, time-entries) está en `front-biosstel-developer/API_SPECIFICATIONS.md`; los endpoints listados aquí son los implementados en el monorepo actual.
