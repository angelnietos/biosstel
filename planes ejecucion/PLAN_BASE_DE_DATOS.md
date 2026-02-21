# Plan base de datos – Biosstel

Esquemas actuales, tablas pendientes para cubrir todos los flujos, y estrategia de migraciones.

---

## 1. Esquemas y tablas actuales

### 1.1 Inicialización (docker/init-db.sql)

- **Schemas:** `auth_schema`, `app_schema` (permisos a usuario `biosstel`).
- **Tablas en `public`:**

| Tabla | Uso |
|-------|-----|
| `users` | id, email, password, firstName, lastName, phone, isActive, organizationId, role, createdAt, updatedAt |
| `dashboard_objectives` | Objetivos tarjeta Inicio (title, achieved, objective, unit, href, accent, isActive) |
| `dashboard_alerts` | Alertas (usuario, departamento, centroTrabajo, rol, estado, statusType, sortOrder, isActive) |
| `terminal_objectives` | Cabecera objetivos terminales (title, rangeLabel, achieved, objective, pct, isActive) |
| `terminal_assignments` | Asignaciones por objetivo (terminalObjectiveId, groupType, groupTitle, label, value, total, ok, sortOrder) |

### 1.2 TypeORM (synchronize en dev)

Entidades que crean/usan tablas:

| Entidad | Tabla | Módulo |
|---------|-------|--------|
| UserEntity | users | api-usuarios |
| DashboardObjectiveEntity | dashboard_objectives | api-objetivos |
| DashboardAlertEntity | dashboard_alerts | api-objetivos (usada por api-alertas) |
| TerminalObjectiveEntity | terminal_objectives | api-objetivos |
| TerminalAssignmentEntity | terminal_assignments | api-objetivos |
| FichajeEntity | fichajes | api-fichajes |
| TaskEntity | tasks | api-fichajes |
| AgendaEntity | agendas | api-fichajes |
| ProductEntity | products | api-productos |
| InventoryItemEntity | inventory_items | api-productos |

---

## 2. Tablas / entidades pendientes (por flujo)

Para cubrir el 100% de los flujos (Figma + planes ejecución) se identifican las siguientes necesidades.

### 2.1 Usuario/as y empresa

| Concepto | Tabla propuesta | Campos sugeridos | Uso |
|----------|-----------------|------------------|-----|
| Departamentos | `departments` | id, code, name, responsibleUserId, dateFrom, dateTo, createdAt, updatedAt | Modal Añadir Departamento; filtros listado usuarios |
| Centros de trabajo | `work_centers` | id, name, departmentId?, address?, isActive, createdAt, updatedAt | Filtros; asignación usuario a centros |
| Relación usuario – centros | `user_work_centers` | userId, workCenterId (PK compuesta o id) | Tags centro de trabajo en usuario |
| Documentación usuario | `user_documents` | id, userId, name, filePathOrUrl, mimeType, createdAt | Detalle Usuario → Añadir Documentación, listar, descargar, eliminar |

**Nota:** Si `users` ya tiene `organizationId` o campos de departamento/centro, decidir si ampliar users o usar tablas relacionales.

### 2.2 Fichajes (calendarios, horarios, permisos)

| Concepto | Tabla propuesta | Campos sugeridos | Uso |
|----------|-----------------|------------------|-----|
| Calendarios laborales | `work_calendars` | id, name, description?, isDefault?, createdAt, updatedAt | Modal Crear calendario; asignación a usuario |
| Horarios laborales | `work_schedules` | id, name, hoursPerYear, vacationDays, freeDisposalDays, hoursPerDayWeekdays, hoursPerDaySaturday, hoursPerWeek, createdAt, updatedAt | Listado consultivo; modal Nuevo Horario; asignación a usuario |
| Permisos (tipos) | `leave_permission_types` | id, name, isPaid (retribuido/no retribuido), createdAt, updatedAt | Modal Nuevo Permiso; listado permisos |
| Asignación usuario – calendario/horario | `user_calendars` / `user_schedules` | userId, calendarId o scheduleId, dateFrom, dateTo | Datos para cálculo de horas y alertas |

**Nota:** Fichajes y tareas ya tienen `fichajes`, `tasks`, `agendas`; falta modelo para “calendario laboral” y “horario laboral” y “permiso” según Figma.

### 2.3 Objetivos y productos

- **terminal_objectives**, **terminal_assignments**: ya existen. Valorar si faltan campos (ej. periodo, isActive para desactivar).
- **Productos / inventario:** `products`, `inventory_items` existen. Valorar tablas para “asignaciones departamento” en nuevo producto (ej. `product_department_assignments`) si se persisten.

### 2.4 Alertas

- **dashboard_alerts** ya existe. Valorar si los filtros (Marca, Fecha, Departamentos) requieren campos o tablas adicionales (ej. marcas como entidad si aplica).

---

## 3. Relación usuario – rol

- **Actual:** `users.role` (texto). Suficiente si se guarda "ADMIN" o "Administrador" y se normaliza en front.
- **Recomendación:** Mantener un único campo role; documentar valores permitidos (ADMIN, COORDINADOR, COMERCIAL, TIENDA, TELEMARKETING, BACKOFFICE) y que login/me devuelvan role para permisos en front.

---

## 4. Estrategia de migraciones

| Entorno | Enfoque |
|---------|---------|
| **Desarrollo** | Opción A: seguir con `synchronize: true` y añadir entidades TypeORM para las nuevas tablas; init-db.sql solo para tablas que deban existir antes del primer arranque. Opción B: desactivar synchronize y usar migraciones TypeORM o SQL versionadas. |
| **Producción** | Siempre migraciones versionadas (SQL o TypeORM migrations). No usar synchronize. |
| **Scripts** | Crear carpeta `migrations/` o `docker/migrations/` con scripts numerados (001_add_departments.sql, etc.) y documentar orden de ejecución. |

---

## 5. Checklist de implementación DB

- [ ] Definir y crear tablas: `departments`, `work_centers`, `user_work_centers` (si aplica).
- [ ] Definir y crear: `user_documents` (o equivalente) para documentación usuario.
- [ ] Definir y crear: `work_calendars`, `work_schedules`, `leave_permission_types` y tablas de asignación usuario-calendario/horario si aplica.
- [ ] Añadir entidades TypeORM para las nuevas tablas y registrarlas en los módulos correspondientes.
- [ ] Actualizar init-db.sql o añadir migraciones para entornos sin synchronize.
- [ ] Seed mínimo (opcional): departamentos, centros, un calendario/horario por defecto para pruebas.

---

## 6. Referencias

- Entidades actuales: `libs/backend/api-*/src/infrastructure/persistence/`.
- Init DB: `docker/init-db.sql`.
- App module: `apps/api-biosstel/src/app.module.ts` (TypeORM forRoot + módulos con forFeature).
