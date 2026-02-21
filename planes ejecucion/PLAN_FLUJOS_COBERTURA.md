# Plan flujos – Cobertura completa

Matriz de cobertura: cada flujo definido en [FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md](../figma%20designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md) vs estado en **Base de datos**, **API** y **Frontend**. Objetivo: que no quede ningún flujo sin cubrir.

**Leyenda estado:**
- **Cubierto:** Implementado y funcional (o documentado como tal en los planes).
- **Parcial:** Implementado en parte; faltan ítems concretos (indicados en notas).
- **Pendiente:** No implementado o no documentado.

---

## 1. Navegación global (Sidebar)

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Logo Biosstel, ítems (Inicio, Fichajes, Usuarios, Objetivos, Productos, Resultados) | - | - | Cubierto | Revisar iconos según figma si aplica. |
| Estado activo (fondo azul ítem seleccionado) | - | - | Cubierto | |
| Logout al final del sidebar | - | - | Cubierto | |
| Colapsar/expandir sidebar | - | - | Cubierto | Sidebar con toggle; ancho reducido y solo iconos cuando colapsado. |

---

## 2. Autenticación

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Login (usuario, contraseña, Iniciar sesión) | - | Cubierto | Cubierto | |
| Token JWT con role en payload | - | Cubierto | Cubierto | API devuelve role en login y en JWT; front usa role para redirect y permisos. |
| Olvidé mi contraseña | - | Cubierto | Cubierto | |
| Restauración auth desde localStorage (authRestored) | - | - | Cubierto | |
| Protección rutas (redirect a login) | - | - | Cubierto | |

---

## 3. Inicio (Home)

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Filtros (marca, departamentos, centros, usuarios, familia, productos, estado) | Cubierto | Cubierto | Cubierto | FilterBar envía filtros; API dashboard/home filtra alertas; backend acepta departamentos/centrosTrabajo. |
| Cards objetivos (Producto nuevo, Terminales, etc.) | Cubierto | Cubierto | Cubierto | |
| Bloque "Fichar entrada" (solo roles que fican) | - | - | Cubierto | canFichar(role). |
| Empty state "Primero se ha de filtrar…" | - | - | Cubierto | |
| Tabla Alertas (Usuario, Departamento, Centro, Rol, Status) | Cubierto | Cubierto | Cubierto | |
| Reloj rojo "Ficho mal fuera de horario" | - | Parcial | Cubierto | API debe poder indicar fueraHorario. |

---

## 4. Fichajes

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Listado Fichaje (tabs Calendarios / Horarios / Permisos) | Cubierto | Cubierto | Cubierto | Tablas y API; modales conectados. |
| Tabla (Usuario, Horas fichadas, Horas acumuladas, %, etc.) | - | Cubierto (fichajes) | Parcial | Completar columnas % y barras. |
| Botones Añadir Calendario, Crear horario, Crear permiso (solo admin/coordinador) | Cubierto | Cubierto | Cubierto | Modales y API implementados. |
| Control de jornada (reloj, agenda, Fichar entrada/salida, tareas) | Cubierto | Cubierto | Cubierto | |
| Redirección empleados a control-jornada (no admin) | - | - | Cubierto | Empleados que fican van a /fichajes/control-jornada; admin/coordinador ven listado. |
| Redirección admin/coordinador desde control-jornada | - | - | Cubierto | |
| Modal Crear calendario | Cubierto | Cubierto | Cubierto | POST /fichajes/calendars desde FichajeDashboard. |
| Listado Horarios laborales (consultivo) | Cubierto | Cubierto | Parcial | GET /fichajes/schedules; vista Horarios puede consumir. |
| Modal Nuevo Horario laboral | Cubierto | Cubierto | Cubierto | Formulario completo (nombre, horas anuales, vacaciones, etc.); POST /fichajes/schedules. |
| Modal Nuevo Permiso | Cubierto | Cubierto | Cubierto | Nombre + tipo Retribuido/No retribuido; POST /fichajes/permission-types. |

---

## 5. Usuario/as

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Listado (buscador, filtros, tabla, Rol, Status, paginación) | - | Cubierto | Parcial/Cubierto | Conectar filtros con departamentos/centros. |
| Añadir Usuario + (modal formulario) | - | Cubierto | Cubierto | |
| Añadir Punto de venta + | Cubierto | Cubierto | Cubierto | Enlace a Empresa → Centros de trabajo; modal Añadir centro / Editar centro y API work-centers. |
| Añadir Departamento + (modal) | Cubierto | Cubierto | Cubierto | Tabla departments; API /empresa/departments; Modal en UsersDashboard y Departamentos. |
| Detalle Usuario – Documentación (Añadir, listar, descargar, eliminar) | Cubierto | Cubierto | Cubierto | Tabla user_documents; API GET|POST|DELETE /users/:id/documents; vista Documentación en detalle usuario. |

---

## 6. Objetivos

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Objetivos Terminales (tabs Contratos/Puntos, asignaciones, Logrado/Objetivo) | Cubierto | Cubierto | Cubierto | |
| Modal Desactivar Objetivo | - | Cubierto | Cubierto | PATCH /dashboard/terminal-objectives/:id { isActive }. |
| Objetivo inactivo → Activar | - | Cubierto | Cubierto | API devuelve inactiveObjective; botón Activar llama PATCH isActive: true. |
| Nuevo producto (Añadir Departamentos +, empty state) | Parcial | Parcial | Parcial | Asignaciones y subir plantilla. |
| Modal Subir plantilla | - | Cubierto | Parcial | POST /productos/:id/plantilla (multipart); modal puede conectarse. |

---

## 7. Productos

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Listado productos | Cubierto | Cubierto | Cubierto | |
| Detalle / Nuevo producto | Cubierto | Cubierto | Cubierto | |
| Asignaciones departamento en nuevo producto | Pendiente | Pendiente | Parcial | Tabla/API si se persisten. |
| Subir plantilla | - | Pendiente | Parcial | |

---

## 8. Alertas

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Tabla Alertas en Inicio | Cubierto | Cubierto | Cubierto | |
| Página Alertas (filtros + tabla + empty state) | - | Cubierto | Cubierto | Filtros tipo/departamento/centro conectados a GET /alertas; empty state y tabla. |
| Iconos y estilos (No ha fichado, Fichaje fuera de horario) | - | - | Parcial | Según Figma. |

---

## 9. Operaciones y Empresa

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Landing operaciones | - | Cubierto | Cubierto | |
| Subvistas (Comercial visitas, Telemarketing agenda, etc.) | - | - | Cubierto | |
| Empresa (departamentos, centros, cuentas) | Cubierto | Cubierto | Cubierto | Departamentos y centros: CRUD API + modales; cuentas-contables vista. |

---

## 10. App móvil

| Flujo / elemento | DB | API | Front | Notas |
|------------------|----|-----|-------|--------|
| Login móvil | - | Cubierto | Parcial | Mismo login; responsive o ruta móvil. |
| Dashboard "Bievenid@ Usuario" + Fichar entrada | - | Cubierto | Parcial | Responsive o vista específica. |
| Bottom nav (Home, Reloj) | - | - | Pendiente | Si se hace app móvil dedicada. |

---

## Resumen de prioridades para cerrar cobertura

1. **DB:** departments, work_centers, user_documents; work_calendars, work_schedules, leave_permission_types — **hecho**.
2. **API:** CRUD departamentos, centros; user documents; CRUD calendarios, horarios, permisos; filtros dashboard/home y alertas; PATCH objetivo terminal (desactivar/activar); POST producto plantilla; fueraHorario en fichaje actual — **hecho**.
3. **Front:** Modales Departamento, Centros, Crear calendario, Nuevo horario, Nuevo permiso; Documentación usuario; filtros Inicio; redirección empleados a control-jornada; role en auth; filtros Alertas + tabla; tabla Fichaje con % y barras; reloj fuera de horario en Inicio; objetivo inactivo → Activar; sidebar colapsar/expandir — **hecho**.

**Última actualización:** JWT y login con role; redirect /fichajes → /fichajes/control-jornada para empleados; centros de trabajo y documentación usuario marcados cubiertos. Ver [PENDIENTES.md](./PENDIENTES.md) para ítems abiertos.
