# Plan: implementar funcionalidades y tests faltantes para entrega a cliente

Este documento es la guía de implementación para cerrar gaps y dejar la app lista para entrega. Se basa en [ESTADO_FUNCIONALIDADES_Y_TESTS.md](./ESTADO_FUNCIONALIDADES_Y_TESTS.md) y en los TODOs/placeholders del código.

**Orden recomendado:** Fase 1 (objetivos y auth) → Fase 2 (alertas/operaciones) → Fase 3 (forgot-password y pulido) → Fase 4 (tests E2E de layout y checklist final).

---

## Fase 1: Objetivos terminales – Asignaciones persistentes

### Paso 1.1 – API: CRUD de asignaciones a objetivo terminal

#### 1. Objetivo
Permitir crear, listar y eliminar asignaciones (departamento o persona) a un objetivo terminal para que “Añadir departamentos” y las asignaciones de personas persistan en BD y no solo en sesión.

#### 2. Qué se va a construir o decidir
- **Backend (libs/backend/api-objetivos):**
  - Endpoint `POST /api/v1/dashboard/terminal-objectives/:id/assignments` con body `{ groupType: 'department' | 'person', groupTitle: string, label?: string, sortOrder?: number }`. Crear `TerminalAssignmentEntity` asociada al `terminalObjective.id`.
  - Endpoint `DELETE /api/v1/dashboard/terminal-objectives/:id/assignments/:assignmentId` para quitar una asignación.
  - Opcional: `PATCH .../assignments/:assignmentId` si se quiere editar label/sortOrder/value/total/ok.
- El repositorio ya existe (`TerminalAssignmentEntity`, `TypeOrmDashboardRepository` lee assignments); solo falta exponer escritura vía controller y, si se desea, un use case en capa application.

#### 3. Código de ejemplo o de implementación

**Controller (añadir en `dashboard.controller.ts`):**

```typescript
// DTO
class CreateAssignmentDto {
  @IsIn(['department', 'person'])
  groupType!: 'department' | 'person';
  @IsString()
  @MaxLength(255)
  groupTitle!: string;
  @IsOptional()
  @IsString()
  @MaxLength(255)
  label?: string;
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

@Post('terminal-objectives/:id/assignments')
@ApiOperation({ summary: 'Añadir asignación (departamento o persona) al objetivo terminal' })
async createAssignment(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() dto: CreateAssignmentDto,
) {
  return this.dashboardService.createTerminalAssignment(id, {
    groupType: dto.groupType,
    groupTitle: dto.groupTitle,
    label: dto.label ?? dto.groupTitle,
    sortOrder: dto.sortOrder ?? 0,
  });
}

@Delete('terminal-objectives/:objectiveId/assignments/:assignmentId')
@ApiOperation({ summary: 'Eliminar asignación' })
async deleteAssignment(
  @Param('objectiveId', ParseUUIDPipe) objectiveId: string,
  @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
) {
  await this.dashboardService.deleteTerminalAssignment(objectiveId, assignmentId);
  return { ok: true };
}
```

**Servicio:** En `dashboard.service.ts` inyectar `Repository<TerminalAssignmentEntity>`. En `createTerminalAssignment` comprobar que el objetivo existe y pertenece al tipo/periodo esperado, luego `assignmentRepo.save({ terminalObjectiveId: id, ... })`. En `deleteTerminalAssignment` comprobar que la asignación pertenece al objetivo y hacer `assignmentRepo.delete(assignmentId)`.

#### 4. Resolución de ambigüedades
- **groupTitle vs department id:** Si en el futuro se relaciona con entidad Departamento, se puede añadir `departmentId` opcional; de momento `groupTitle` es el nombre mostrado (ej. "Comercial") y basta para las cards.
- **Personas:** Mismo contrato con `groupType: 'person'` y `groupTitle` como nombre del usuario o identificador mostrado.

#### 5. Resultado esperado
- `POST .../terminal-objectives/:id/assignments` crea la fila en `terminal_assignments` y devuelve la asignación creada.
- `DELETE .../.../assignments/:assignmentId` elimina la asignación.
- GET `terminal-objectives` ya devuelve `departmentCards` y `peopleCards` desde el repo; al crear/borrar asignaciones, el siguiente GET refleja los cambios.

---

### Paso 1.2 – Front: conectar “Añadir departamentos” y asignaciones personas a la API

#### 1. Objetivo
Que el flujo “Añadir departamentos +” y, si existe UI equivalente para personas, persista en backend y que al recargar la página se sigan viendo las asignaciones.

#### 2. Qué se va a construir o decidir
- En la feature objetivos: cliente API que llame a `POST .../terminal-objectives/:id/assignments` y `DELETE .../.../assignments/:assignmentId`.
- En `TerminalObjectivesPage`: al confirmar “Añadir departamentos”, obtener lista de departamentos (desde empresa o usuarios) y por cada uno elegido llamar a `createAssignment` con `groupType: 'department'` y `groupTitle: nombre`. Eliminar estado local `addedDepartments` y usar solo datos del servidor; tras crear, hacer `refetch()` de objetivos.
- Si hay modal “Añadir personas”, mismo patrón con `groupType: 'person'`.

#### 3. Código de ejemplo
- Servicio en `libs/frontend/features/objetivos/src/api/services/` (ej. `dashboard.ts`):  
  `createTerminalAssignment(objectiveId: string, body: { groupType, groupTitle, label?, sortOrder? })` → `fetch(PATCH no, POST) .../terminal-objectives/${objectiveId}/assignments`, `deleteTerminalAssignment(objectiveId, assignmentId)` → `fetch(DELETE ...)`.
- En la página: reemplazar la lógica que solo hacía `setAddedDepartments` por llamadas a `createTerminalAssignment` y luego `refetch()`. Quitar el toast que dice “hace falta un endpoint de asignaciones”.

#### 4. Resolución de ambigüedades
- Lista de departamentos: si la app ya tiene `GET /empresa` o similar con departamentos, usar esa lista para el selector. Si no, usar una lista fija o un endpoint de departamentos existente en el proyecto.

#### 5. Resultado esperado
- El usuario puede añadir departamentos (y personas si hay UI) al objetivo activo; se persisten en BD y se ven al recargar. Eliminar asignación desde la UI (si se implementa botón) debe llamar a DELETE y refrescar.

---

### Paso 1.3 – Tests para asignaciones

#### 1. Objetivo
Asegurar que el CRUD de asignaciones no se rompe y que la persistencia es correcta.

#### 2. Qué se va a construir
- **E2E API** (en `apps/e2e-api/tests/objetivos.spec.ts` o nuevo `objetivos-assignments.spec.ts`):  
  - Dado un objetivo terminal existente, `POST .../terminal-objectives/:id/assignments` con `groupType: 'department', groupTitle: 'Comercial'` → 201 y body con `id`.  
  - `GET .../terminal-objectives?type=contratos` debe incluir en `departmentCards` una card con título "Comercial".  
  - `DELETE .../terminal-objectives/:id/assignments/:assignmentId` → 200/204.  
  - GET posterior sin esa asignación.
- **Unit (opcional):** Servicio front que llama a `createTerminalAssignment` / `deleteTerminalAssignment` con `fetch` mockeado.

#### 3–5. Resultado esperado
- E2E API pasan con BD real. Cobertura de persistencia de asignaciones documentada.

---

## Fase 2: Alertas y operaciones (sustituir placeholders)

### Paso 2.1 – Alertas: implementar GET /api/v1/alertas con datos reales

#### 1. Objetivo
El endpoint `GET /alertas` está documentado pero el controller/servicio devuelve placeholder. Entregar datos coherentes con el dashboard (por ejemplo desde `DashboardAlertEntity` o tabla equivalente).

#### 2. Qué se va a construir
- Revisar si `api-objetivos` o algún módulo ya expone alertas (p. ej. `DashboardAlertEntity` en TypeOrmDashboardRepository). Si las alertas son las del dashboard home, se pueden reutilizar.
- Si `api-alertas` es el dueño: implementar en `api-alertas` un repositorio (TypeORM) que lea la misma tabla que usa el dashboard o la tabla que se decida para “alertas”. El controller de alertas debe devolver array de alertas (id, usuario, departamento, centroTrabajo, rol, estado, statusType, etc.) en lugar del string placeholder.

#### 3. Código de ejemplo
- Controller: `GET /alertas` → llamar a `alertasService.findAll()` o a un use case que use el repositorio y devolver `{ data: alerts }` o directamente el array.
- Repositorio: `find({ where: { isActive: true }, order: { sortOrder: 'ASC' } })` sobre la entidad de alertas (si está en api-objetivos, podría inyectarse desde ahí o moverse a api-alertas según límites del monorepo).

#### 4. Resolución de ambigüedades
- Si la única fuente de verdad de alertas es la usada por el dashboard home, evitar duplicar lógica: un solo lugar (repositorio) y que tanto dashboard como GET /alertas lo usen.

#### 5. Resultado esperado
- `GET /api/v1/alertas` devuelve JSON con lista de alertas. E2E API puede assert status 200 y estructura. Front que consuma este endpoint muestra datos reales.

---

### Paso 2.2 – Operaciones: implementar GET /api/v1/operaciones

#### 1. Objetivo
Sustituir el placeholder de operaciones por una respuesta real (lista de operaciones o estructura acordada para el front).

#### 2. Qué se va a construir
- Definir modelo de datos: por ejemplo lista de “operaciones” (nombre, estado, fechas, etc.) según lo que muestre el front (TelemarketingAgenda, BackofficeRevision).
- En `api-operaciones`: persistencia (TypeORM) si hace falta tabla nueva, o lectura de tablas existentes (tareas, contratos, etc.). Controller `GET /operaciones` que devuelva ese listado.

#### 3–5. Resultado esperado
- GET /operaciones devuelve datos coherentes con la UI. Tests E2E API opcionales para status y estructura.

---

### Paso 2.3 – Fichajes: verificar implementación real

#### 1. Objetivo
El controller de fichajes ya usa CQRS (mediator, commands/queries). Algunos use cases o repos siguen con mensaje “placeholder”. Verificar que clock-in/out, dashboard y listados usen BD real.

#### 2. Qué se va a construir
- Revisar handlers de `ClockInCommand`, `ClockOutCommand`, `GetFichajeDashboardQuery`, etc.: que usen un repositorio TypeORM que lea/escriba en la tabla de fichajes.
- Si algún handler sigue devolviendo “Fichajes API placeholder”, sustituir por llamada al repositorio y datos reales.

#### 3–5. Resultado esperado
- Fichajes totalmente funcionales contra BD. E2E API de fichajes (si existen) pasan; si no, añadir al menos un test de clock-in y GET dashboard.

---

## Fase 3: Forgot password (flujo completo)

### Paso 3.1 – Decisión de diseño: email real vs mock

#### 1. Objetivo
Definir si “recuperar contraseña” enviará email real o solo mensaje genérico para entrega (mock).

#### 2. Qué se va a construir o decidir
- **Opción A (mock para entrega):** Mantener `POST /auth/forgot-password` que acepta `email`, valida que el usuario exista (consultando BD), y siempre devuelve el mismo mensaje genérico (“Si el email existe...”). No envía email. Marcar en código y en docs que es “mock para entrega; integrar envío real después”.
- **Opción B (email real):** Integrar un servicio de email (SendGrid, Nodemailer con SMTP, etc.), generar token de reset con caducidad (p. ej. 1h), guardarlo en BD o cache, y enviar enlace. Endpoint `POST /auth/reset-password` con token + nueva contraseña.

#### 3. Código de ejemplo (Opción A – mock)
- En `AuthManagementUseCase.forgotPassword`: inyectar repositorio de usuarios (o usar el existente de auth). Si `body.email` existe en BD, registrar en log “Forgot password requested for <email>” (no enviar email). Respuesta: `{ message: 'Si el email existe, recibirás un enlace...' }` igual para todos (evitar enumeración de usuarios).

#### 4. Resolución de ambigüedades
- Seguridad: no revelar si el email está registrado. Mismo mensaje y mismo status (200) en ambos casos.

#### 5. Resultado esperado
- Decisión documentada. Si mock: endpoint estable y sin TODOs de “enviar email”. Si real: enlace de reset y endpoint de reset implementados y con tests.

---

### Paso 3.2 – Implementar forgot-password (mock o real) y tests

#### 1. Objetivo
Implementar la opción elegida y cubrirla con tests.

#### 2. Qué se va a construir
- Backend: como en 3.1 (validar email opcional, mensaje único; o enviar email + token).
- Front: ForgotPasswordForm ya existe; asegurar que envía `POST /auth/forgot-password` con `{ email }` y muestra el mensaje de éxito/error según respuesta.
- E2E API: `POST /auth/forgot-password` con email válido → 200 y mensaje; con email inexistente (si mock) → 200 y mismo mensaje.

#### 3–5. Resultado esperado
- Flujo de “¿Olvidaste contraseña?” funcional de punta a punta. Tests E2E API y, si hay, test unitario del use case.

---

## Fase 4: Tests y pulido para entrega

### Paso 4.1 – E2E Front: layout (Header / Sidebar)

#### 1. Objetivo
Tener al menos un test E2E que verifique que el Header (Servicio técnico, Usuario, Cerrar sesión) y el Sidebar (nombre, logout) se muestran y son usables tras login.

#### 2. Qué se va a construir
- En `apps/e2e-front/tests/`: spec que tras login haga: clic en “Usuario” en el header y compruebe que aparece el menú con “Cerrar sesión”; opcionalmente clic en “Servicio técnico” y compruebe enlace mailto o que no rompe. En sidebar, comprobar que el bloque de usuario (nombre/email) y el enlace de logout son visibles y no cortados (p. ej. `expect(logoutLink).toBeVisible()` y que el texto del usuario tenga `truncate` o similar en el DOM).

#### 3–5. Resultado esperado
- Un test E2E de “layout autenticado” que pase en CI. Documentado en TESTING.md o ESTADO_FUNCIONALIDADES_Y_TESTS.md.

---

### Paso 4.2 – E2E Objetivos: flujo Guardar configuración completo

#### 1. Objetivo
Cubrir el flujo: activar objetivo → editar meta (objetivo numérico) → Guardar configuración → comprobar que el valor persiste (visible en la página o en siguiente GET).

#### 2. Qué se va a construir
- Test Playwright: ir a objetivos terminales; si hay “Activar”, clic; abrir edición (botón lápiz), cambiar valor de objetivo, clic “Guardar configuración”; después comprobar que el valor mostrado es el guardado (y opcionalmente que un refetch no lo pierde).

#### 3–5. Resultado esperado
- E2E front del flujo “Activar + Editar + Guardar” estable y en la suite de objetivos.

---

### Paso 4.3 – Checklist final y documentación

#### 1. Objetivo
Dejar lista la app para entrega y la documentación al día.

#### 2. Qué se va a construir
- **Checklist (en este doc o en README):**
  - [ ] Login, refresh token, logout y rutas protegidas funcionan.
  - [ ] Objetivos terminales: activar, editar meta, guardar configuración, asignaciones departamentos/personas persistentes.
  - [ ] Fichajes: dashboard, clock-in/out (y pause/resume si se usan).
  - [ ] Alertas y operaciones devuelven datos reales (no placeholder).
  - [ ] Forgot password: flujo implementado (mock o real) y probado.
  - [ ] Header y Sidebar: Servicio técnico, Usuario, Cerrar sesión, nombre visible.
  - [ ] Tests: unitarios y E2E API/Front pasan; cobertura suficiente en áreas críticas.
  - [ ] Variables de entorno y secrets documentados (no commitear claves).
  - [ ] README / docs con instrucciones de despliegue y pruebas.
- Actualizar **ESTADO_FUNCIONALIDADES_Y_TESTS.md**: quitar de “Placeholder o incompleto” todo lo implementado; añadir nuevas pruebas a “Tests añadidos”.
- Actualizar **API_ENDPOINTS.md** si se añaden rutas (assignments, reset-password, etc.).

#### 3–5. Resultado esperado
- Checklist revisable antes de entregar. Documentación coherente con el estado real de la app.

---

## Resumen de prioridad y dependencias

| Fase | Dependencias | Prioridad |
|------|----------------|-----------|
| 1.1 – API asignaciones | Ninguna | Alta |
| 1.2 – Front asignaciones | 1.1 | Alta |
| 1.3 – Tests asignaciones | 1.1, 1.2 | Alta |
| 2.1 – Alertas real | Ninguna | Media |
| 2.2 – Operaciones real | Ninguna | Media |
| 2.3 – Fichajes verificación | Ninguna | Media |
| 3.1 – Decisión forgot-password | Ninguna | Media |
| 3.2 – Implementar forgot-password | 3.1 | Media |
| 4.1 – E2E layout | Ninguna | Media |
| 4.2 – E2E Guardar configuración | Ninguna | Media |
| 4.3 – Checklist y docs | Todas las anteriores | Alta (cierre) |

Implementando en este orden se minimizan bloqueos y se puede entregar por fases (por ejemplo: Fase 1 lista primero para validar con el cliente).
