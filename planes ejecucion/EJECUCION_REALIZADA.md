# Ejecución realizada – Planes de ejecución

Resumen de lo implementado al **ejecutar los planes** (base de datos, API, frontend). Lo no marcado como hecho queda como siguiente iteración.

---

## 1. Base de datos

- **Tablas añadidas en `docker/init-db.sql`:**
  - `departments` (code, name, color, responsibleUserId, dateFrom, dateTo, isActive)
  - `work_centers` (name, address, departmentId, isActive)
  - `work_calendars` (name, description, isDefault)
  - `work_schedules` (name, hoursPerYear, vacationDays, freeDisposalDays, hoursPerDayWeekdays, hoursPerDaySaturday, hoursPerWeek)
  - `leave_permission_types` (name, isPaid)
  - `user_documents` (userId, name, mimeType, filePath, contentBase64, createdAt)

- **Entidades TypeORM:**
  - **api-empresa:** `DepartmentEntity`, `WorkCenterEntity`
  - **api-fichajes:** `WorkCalendarEntity`, `WorkScheduleEntity`, `LeavePermissionTypeEntity`
  - **api-usuarios:** `UserDocumentEntity`

---

## 2. API

- **Empresa (api-empresa):**
  - `GET /empresa` — list() ahora lee departamentos y centros desde BD.
  - `GET|POST|PUT|DELETE /empresa/departments` — CRUD departamentos (DepartmentsController).
  - `GET|POST|PUT|DELETE /empresa/work-centers` — CRUD centros de trabajo (WorkCentersController).

- **Fichajes (api-fichajes):**
  - `GET|POST /fichajes/calendars` — listar y crear calendarios laborales (FichajesCalendarsController).
  - `GET|POST /fichajes/schedules` — listar y crear horarios laborales (FichajesSchedulesController).
  - `GET|POST /fichajes/permission-types` — listar y crear tipos de permiso (FichajesPermissionsController).

- **Documentación de usuario (api-usuarios):**
  - `GET|POST /users/:userId/documents` — listar y subir documentos.
  - `GET /users/:userId/documents/:docId` — descargar documento.
  - `DELETE /users/:userId/documents/:docId` — eliminar documento.

- **Dashboard y alertas (filtros):**
  - `GET /dashboard/home` — acepta query params (departamentos, centrosTrabajo, etc.) y filtra alertas en backend.
  - `GET /alertas` — query params `tipo`, `departamento`, `centroTrabajo` (string o array; split por coma si string).

---

## 3. Frontend

- **Empresa:**
  - Servicio: `createDepartment`, `createWorkCenter` en `libs/frontend/features/empresa/src/services/empresa.ts`.
  - Componente **AddDepartmentModal** (Código, Nombre departamento, Responsable, Fecha alta/baja, Cancelar / Añadir).
  - **UsersDashboard:** botón "Añadir Departamento +" abre el modal (ya no enlaza solo a /empresa/departamentos).
  - **Departamentos:** botón "Añadir departamento" abre el mismo modal y refresca la lista al cerrar.

- **Fichajes:**
  - Servicio: `createCalendar`, `createSchedule`, `createPermissionType` en `fichajesService`.
  - Modal **Crear calendario** en FichajeDashboard: formulario con nombre, botón Crear llama a `POST /fichajes/calendars` y cierra el modal.

---

## 4. Pendiente (siguiente iteración)

Ver listado detallado en **[PENDIENTES.md](./PENDIENTES.md)**. Resumen:

- **API:** Desactivar/activar objetivo terminal; upload plantilla producto.
- **Front:** Filtros página Alertas conectados a API; tabla Fichaje con % y barras; reloj “fuera de horario”; objetivo inactivo → Activar; nuevo producto asignaciones + subir plantilla; sidebar colapsar/expandir (verificar).
- **Opcional:** App móvil dedicada; E2E; documentación en README.

*Nota: user_documents (tabla + API + vista Documentación), modales Nuevo Horario y Nuevo Permiso, filtros dashboard/home, centros de trabajo (Añadir/Editar centro) y role en JWT/login ya están hechos.*

---

## 5. Cómo probar

1. **Levantar BD y API:** `pnpm db:start` (o `pnpm start`) y luego `pnpm dev:api` si corres el front por separado.
2. **Departamentos:** En Usuario/as, clic en "Añadir Departamento +" → rellenar nombre (y opcionalmente código, fechas) → Añadir. O ir a Empresa → Departamentos y usar "Añadir departamento".
3. **Fichajes (admin/coordinador):** "Añadir Calendario laboral +" → nombre → Crear; "Crear horario +" → rellenar campos del horario → Crear; "Crear Permiso +" → nombre y tipo (Retribuido/No retribuido) → Crear.
4. **Documentación usuario:** Ir a Usuario/as → un usuario → pestaña Documentación → Añadir Documentación + (nombre + archivo opcional) → listar, descargar, eliminar.

---

---

## 6. Última actualización

- **Auth:** Login y JWT incluyen `role` (API: AuthManagementUseCase + LoginHandler; TypeOrmUserRepository.validateCredentials devuelve User completo). Front usa role para redirect y permisos.
- **Fichajes:** Usuarios que pueden fichar pero no gestionar (empleados) son redirigidos de `/fichajes` a `/fichajes/control-jornada` (shell CatchAllPage + FichajeDashboard).
- **Seed:** Actualización de contraseña admin con `userRepository.update(..., { password } as Partial<UserEntity>)` para evitar error de tipos TypeORM.

*Documento actualizado tras la ejecución de los planes. Estado por flujo: [PLAN_FLUJOS_COBERTURA.md](./PLAN_FLUJOS_COBERTURA.md). Ítems abiertos: [PENDIENTES.md](./PENDIENTES.md).*
