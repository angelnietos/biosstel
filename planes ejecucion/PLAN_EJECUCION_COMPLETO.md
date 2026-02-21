# Plan de ejecución completo – Biosstel

Plan maestro para implementar **todo** el sistema sin dejar flujos sin cubrir: base de datos, API, frontend, documentación y criterios de cierre.

---

## 1. Objetivos

- **Cobertura total de flujos:** Todos los flujos descritos en [FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md](../figma%20designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md) tienen soporte en DB, API y Front.
- **Arquitectura documentada:** ARQUITECTURA.md y planes por capa (DB, API, Front, Flujos) actualizados.
- **Trazabilidad:** Cada pantalla/acción Figma → flujo → endpoints → entidades/tablas.

---

## 2. Fases de ejecución

### Fase 1 – Base de datos y esquemas

**Objetivo:** Tener todos los esquemas y tablas necesarios para los flujos (usuarios, fichajes, objetivos, alertas, productos, departamentos, centros de trabajo, calendarios, horarios, permisos, documentación usuario).

| Hito | Descripción | Documento de detalle |
|------|-------------|----------------------|
| 1.1 | Inventario de tablas actuales y gap vs flujos | PLAN_BASE_DE_DATOS.md |
| 1.2 | Diseño de tablas faltantes (departamentos, centros_trabajo, calendarios_laborales, horarios_laborales, permisos, user_documents, etc.) | PLAN_BASE_DE_DATOS.md |
| 1.3 | Migraciones o scripts SQL (crear/alter) y seed mínimo | PLAN_BASE_DE_DATOS.md |
| 1.4 | TypeORM entities alineadas con esquema y registradas en módulos | PLAN_BASE_DE_DATOS.md |

**Criterio de cierre:** Ningún flujo requiere una tabla que no exista o no esté definida en el plan.

---

### Fase 2 – API

**Objetivo:** Endpoints completos por flujo: auth, usuarios, fichajes (y tareas), dashboard/objetivos, alertas, productos/inventario, empresa, operaciones; y nuevos dominios si aplica (calendarios, horarios, permisos, documentación).

| Hito | Descripción | Documento de detalle |
|------|-------------|----------------------|
| 2.1 | Inventario de controladores y endpoints actuales | PLAN_API.md |
| 2.2 | Listado de endpoints faltantes por flujo (CRUD departamentos, centros, calendarios, horarios, permisos, documentos usuario, etc.) | PLAN_API.md |
| 2.3 | Contratos (DTOs, respuestas) y autenticación/autorización por ruta | PLAN_API.md |
| 2.4 | Implementación de endpoints y tests (unit/integración) | PLAN_API.md |

**Criterio de cierre:** Cada acción de usuario en el flujo Figma tiene un endpoint (o uso de uno existente) documentado e implementado.

---

### Fase 3 – Frontend

**Objetivo:** Todas las pantallas y modales del flujo implementadas; filtros, tablas, formularios y permisos por rol alineados con Figma y con la API.

| Hito | Descripción | Documento de detalle |
|------|-------------|----------------------|
| 3.1 | Inventario de rutas y features actuales | PLAN_FRONTEND.md |
| 3.2 | Listado de pantallas/modales faltantes por flujo (Añadir Departamento, Crear calendario, Nuevo horario, Nuevo permiso, Detalle usuario documentación, etc.) | PLAN_FRONTEND.md |
| 3.3 | Integración con API (llamadas desde cada vista), manejo de loading/error | PLAN_FRONTEND.md |
| 3.4 | Roles y permisos en UI (ocultar/mostrar según canFichar, canManageFichajes, routesPermissions) | PLAN_FRONTEND.md |
| 3.5 | Estilos y componentes según criterios Figma (cabeceras tabla, cards, empty states) | PLAN_FRONTEND.md |

**Criterio de cierre:** Ninguna pantalla del flujo Figma queda sin implementar o sin enlace desde la navegación/ruta correspondiente.

---

### Fase 4 – Flujos y cobertura

**Objetivo:** Matriz de cobertura actualizada: cada flujo con estado explícito (cubierto / pendiente / parcial) en DB, API y Front.

| Hito | Descripción | Documento de detalle |
|------|-------------|----------------------|
| 4.1 | Matriz flujo → pantallas/acciones → DB/API/Front | PLAN_FLUJOS_COBERTURA.md |
| 4.2 | Revisión periódica: al cerrar un ítem, actualizar la matriz | PLAN_FLUJOS_COBERTURA.md |
| 4.3 | Pruebas E2E o manual por flujo crítico (login, fichar, usuarios, objetivos) | Opcional, documentar en plan |

**Criterio de cierre:** PLAN_FLUJOS_COBERTURA.md sin ítems "pendiente" en los flujos prioritarios.

---

### Fase 5 – Documentación y calidad

**Objetivo:** Arquitectura, planes y flujo Figma al día; README de proyecto y de apps/lib principales; convenciones de código.

| Hito | Descripción |
|------|-------------|
| 5.1 | ARQUITECTURA.md revisado con cualquier nuevo módulo o tabla. |
| 5.2 | README raíz: cómo levantar proyecto, env, scripts (start, db:reset, build, test). |
| 5.3 | Documentación de roles y permisos (PLAN_ROLES_Y_ELEMENTOS.md) alineada con implementación. |
| 5.4 | figma designs y planes ejecución enlazados desde README o docs. |

---

## 3. Dependencias entre fases

- **Fase 1 (DB)** debe estar cerrada o al menos definida antes de implementar nuevos endpoints que usen tablas nuevas.
- **Fase 2 (API)** depende de Fase 1 para entidades y repositorios; el front puede consumir endpoints existentes en paralelo.
- **Fase 3 (Front)** depende de Fase 2 para integración real; se puede avanzar con mocks o endpoints ya existentes.
- **Fase 4** se actualiza a medida que se cierran 1, 2 y 3.
- **Fase 5** es continua y al cierre del proyecto.

---

## 4. Orden sugerido por dominio (ejemplo)

Para no dejar flujos a medias, se puede ejecutar por dominio completo (DB → API → Front) en este orden:

1. **Auth y usuarios:** role en JWT/login; usuarios CRUD; departamentos y centros de trabajo (tablas + API + listado/Add User/Add Departamento).
2. **Fichajes:** fichajes y tareas (ya existen); calendarios laborales, horarios laborales, permisos (tablas + API + modales Crear calendario, Nuevo horario, Nuevo permiso).
3. **Inicio y dashboard:** objetivos y alertas (ya hay tablas/API); filtros y empty state; bloque Fichar entrada por rol.
4. **Objetivos Terminales y producto:** asignaciones, desactivar, nuevo producto, subir plantilla (API y pantallas).
5. **Usuario/as detalle:** documentación usuario (tabla + API subir/listar/eliminar + pantalla Detalle/Documentación).
6. **Alertas:** página dedicada con filtros y tabla (API ya expone alertas; front filtros y estilos).
7. **Productos e inventario:** listados y detalle; nuevo producto con asignaciones.
8. **Operaciones y empresa:** landing y subvistas según permisos.
9. **App móvil (opcional):** responsive o rutas específicas para login y dashboard móvil.

---

## 5. Checklist de cierre por flujo

Para cada flujo del documento [FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md](../figma%20designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md):

- [ ] **DB:** Tablas y relaciones definidas y creadas (o documentadas en plan).
- [ ] **API:** Endpoints necesarios implementados y documentados en PLAN_API.md.
- [ ] **Front:** Pantallas y modales implementadas; navegación y permisos correctos.
- [ ] **Cobertura:** Fila correspondiente en PLAN_FLUJOS_COBERTURA.md marcada como "cubierto".

---

## 6. Referencias cruzadas

| Necesito… | Ver documento |
|-----------|----------------|
| Esquemas y tablas DB | PLAN_BASE_DE_DATOS.md |
| Endpoints por módulo y faltantes | PLAN_API.md |
| Rutas y pantallas front, faltantes | PLAN_FRONTEND.md |
| Estado por flujo (Figma) | PLAN_FLUJOS_COBERTURA.md |
| Ítems pendientes (único listado) | PENDIENTES.md |
| Visión técnica global | ARQUITECTURA.md |
| Listado de pantallas y flujos | figma designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md |

---

*Este plan debe actualizarse al añadir nuevos flujos o al cerrar hitos.*
