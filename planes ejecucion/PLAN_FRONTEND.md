# Plan frontend – Biosstel

Rutas y features actuales, pantallas y modales faltantes por flujo, integración con API y criterios por rol y Figma.

---

## 1. Rutas actuales (routeRegistry)

### 1.1 Principales (MAIN_ROUTES)

| Ruta (sin locale) | Feature | Componente principal |
|-------------------|---------|----------------------|
| home | objetivos | DashboardHomePage |
| clock | fichajes | FichajeDashboard |
| backOffice | operaciones | BackOfficeLanding |
| productos, productos/nuevo | productos | ProductosPage, NuevoProductoPage |
| inventory | inventory | InventoryPage |
| reports | reports | ReportsPage |
| objetivos, objetivos-terminales | objetivos | Niveles, TerminalObjectivesPage |
| fichajes | fichajes | FichajeDashboard |
| fichajes/control-jornada, horarios, calendario-laboral, fichaje-manual, permisos, geolocalizacion | fichajes | ControlJornada, Horarios, CalendarioLaboral, FichajeManual, Permisos, Geolocalizacion |
| empresa, empresa/departamentos, centros-trabajo, cuentas-contables | empresa | EmpresaShell, Departamentos, CentrosTrabajo, CuentasContables |
| alertas, alertas/* | alertas | AlertasShell, AlertasVentas, Recordatorios, TrackingAlerts |
| operaciones, operaciones/* | operaciones | OperacionesShell, ComercialVisitas, TelemarketingAgenda, BackofficeRevision, TiendaVentas |
| home/pending-tasks, home/register-tasks, home/objectives, home/objectives/:id | fichajes/objetivos | PendingTasksPage, RegisterTasksPage, TerminalObjectivesPage, ObjectiveDetailPage |
| objetivos/niveles, asignacion-personas, asignacion-departamentos, historico-objetivos, plantillas | objetivos | Niveles, AsignacionPersonas, etc. |

### 1.2 Admin (ADMIN_ROUTES)

| Ruta | Feature | Componente |
|------|---------|------------|
| users | usuarios | UsersDashboard |
| users/:id | usuarios | DetalleUsuario |
| users/:id/documentacion | usuarios | Documentacion |
| configuracion-perfil | usuarios | ConfiguracionPerfil |
| add-user | usuarios | AddUserForm |
| add-client | usuarios | AddClientForm |

### 1.3 Auth (AUTH_ROUTES)

| Ruta | Feature | Componente |
|------|---------|------------|
| login | auth | LoginForm |
| forgot-password | auth | ForgotPasswordForm |
| email-send, verify-account, registro-salida | auth | EmailSendMessage, VerifyAccountMessage, RegistroSalida |

---

## 2. Pantallas / modales faltantes o a cerrar (por flujo)

### 2.1 Usuario/as (figma3)

| Elemento | Estado | Acción |
|----------|--------|--------|
| Listado con buscador y filtros (Departamento, Centro, Estado) | Parcial/implementado | Revisar placeholder buscador y filtros; conectar con API departamentos/centros si existen. |
| Modal Añadir Departamento | Pendiente | Crear modal/página con campos: Código, Nombre, Responsable, Fecha alta/baja; llamar POST departamentos. |
| Modal Añadir Usuario (variante coordinador con “Usuarios otras plataformas”) | Parcial | Completar variante según Base-10 si aplica. |
| Detalle Usuario – Documentación (Añadir Documentación +, lista, descargar, eliminar) | Parcial/implementado | Conectar con API user documents; subir archivo y listar/eliminar. |

### 2.2 Fichajes (figma4)

| Elemento | Estado | Acción |
|----------|--------|--------|
| Modal Crear calendario | Placeholder | Implementar formulario y POST work-calendars (cuando API exista). |
| Listado Horarios laborales (consultivo) | Vista Horarios | Asegurar tabla con columnas Figma; GET work-schedules. |
| Modal Nuevo Horario laboral | Pendiente | Formulario con campos Base-25; POST work-schedules. |
| Modal Nuevo Permiso | Pendiente | Formulario nombre + tipo (Retribuido/No retribuido); POST leave-permission-types. |
| Tabla listado Fichaje (Usuario, Horas, %, etc.) | Parcial | Completar columnas % con barras (verde/rojo/naranja) si API lo permite. |

### 2.3 Objetivos (figma2)

| Elemento | Estado | Acción |
|----------|--------|--------|
| Modal Desactivar Objetivo | Implementado | Verificar llamada PATCH/desactivar a API. |
| Objetivo inactivo (botón Activar) | Parcial | Mostrar botón y llamar activar si API existe. |
| Nuevo producto – Añadir Departamentos +, Subir plantilla | Parcial | Conectar asignaciones con API; subir archivo si hay endpoint. |

### 2.4 Inicio y Alertas

| Elemento | Estado | Acción |
|----------|--------|--------|
| Filtros Inicio (marca, departamentos, etc.) | Parcial | Conectar filtros con GET dashboard/home con query params. |
| Empty state “Primero se ha de filtrar…” | Implementado | Mantener. |
| Página Alertas (filtros + tabla) | Parcial | Completar filtros y tabla; GET alertas con params. |

### 2.5 Navegación y roles

| Elemento | Estado | Acción |
|----------|--------|--------|
| Sidebar (iconos, activo, logout) | Implementado | Revisar según figma/plan_ajuste_diseño_sidebar. |
| Ocultar “Fichar entrada” y gestión de jornada para admin/coordinador | Implementado | Mantener canFichar, canManageFichajes y redirect control-jornada. |
| Ocultar botones Añadir Calendario / Crear horario / Crear permiso para no admin/coordinador | Implementado | Mantener canManageFichajes. |

---

## 3. Integración con API

- **Auth:** useLogin → POST /auth/login; AuthRestore desde token; getAuthHeaders() en todas las peticiones autenticadas.
- **Usuarios:** createUser, listado, detalle (endpoints existentes); cuando existan: departamentos, centros, user documents.
- **Fichajes:** clockIn, clockOut, fetchCurrentFichaje, fetchFichajes; tasks CRUD. Cuando existan: work-calendars, work-schedules, leave-permission-types.
- **Dashboard:** GET dashboard/home y dashboard/terminal-objectives; GET alertas con filtros.
- **Productos:** CRUD productos e inventario; cuando exista: upload template y asignaciones departamento.

Manejo de loading (skeleton o spinner) y errores (mensaje o toast) en cada vista que llame a la API.

---

## 4. Criterios Figma (recordatorio)

- Títulos: Heading level 1, gray-900.
- Cards: border-card, rounded-xl, shadow-sm.
- Tablas: cabecera bg-table-header; texto gray-900 / muted.
- Botones: px-5, min-h-[43px], whitespace-nowrap donde aplique.
- Empty states: texto gris + CTA.
- Modales: título, Cancelar + acción principal.

---

## 5. Checklist de implementación frontend

- [ ] Modal Añadir Departamento (formulario + POST departamentos).
- [ ] Modal Crear calendario (formulario + POST work-calendars).
- [ ] Modal Nuevo Horario laboral (formulario Base-25 + POST work-schedules).
- [ ] Modal Nuevo Permiso (nombre + tipo + POST leave-permission-types).
- [ ] Detalle Usuario – Documentación: subir/listar/eliminar documentos (API user documents).
- [ ] Filtros Inicio y Alertas conectados a API con query params.
- [ ] Tabla Fichaje con columnas % y barras según diseño (datos desde API).
- [ ] Nuevo producto: asignaciones departamento y subir plantilla (cuando API exista).
- [ ] Revisión final Sidebar y roles (ocultar/mostrar según canFichar, canManageFichajes, routesPermissions).

---

## 6. Referencias

- Rutas: `libs/frontend/shell/src/routeRegistry.tsx`.
- Permisos rutas: `libs/frontend/platform/src/config/routesPermissions.ts`.
- Roles: `libs/frontend/platform/src/constants/roles.ts`.
- Plan roles por pantalla: `apps/front-biosstel/docs/PLAN_ROLES_Y_ELEMENTOS.md`.
