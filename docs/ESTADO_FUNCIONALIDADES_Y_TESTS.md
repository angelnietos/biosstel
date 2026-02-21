# Estado de funcionalidades y tests

Resumen de qué está terminado, con tests, y qué queda como placeholder o pendiente.

## Comandos de test

- **Unitarios:** `pnpm test` / `pnpm test:coverage`
- **E2E API:** `pnpm test:e2e` (proyecto `e2e-api`) — requiere BD + API
- **E2E Front:** `pnpm test:e2e` (proyecto `e2e-front`) — requiere API + Front
- Detalle: [TESTING.md](./TESTING.md)

---

## Funcionalidades completas con tests

| Área | Funcionalidad | Tests |
|------|----------------|-------|
| **Auth** | Login, refresh token, caducidad, renovación en 401, forgot password (mock) | Unit: `auth.test.ts`. E2E API: `auth.spec.ts` (login, refresh, forgot-password) |
| **Objetivos terminales** | GET, PATCH objetivo, POST/DELETE asignaciones, Activar en UI, Guardar configuración, Añadir/eliminar departamentos | Unit: `dashboard.test.ts`. E2E API: `objetivos.spec.ts` (incl. assignments). E2E Front: `objetivos-terminales-flows.spec.ts` (Activar, Guardar configuración) |
| **Persistencia CRUD** | Productos, departamentos, inventario, tareas, centros de trabajo, clientes | E2E API: `productos.spec.ts`, `departments.spec.ts`, etc. (persistencia en BD) |
| **Alertas / Operaciones** | GET /alertas con datos reales (DashboardAlertEntity). GET /operaciones con estructura (agenda, visitas, etc.). | Implementado en backend. |
| **Fichajes** | Dashboard, clock-in/out con PostgresFichajeRepository | Implementado. |
| **UI compartida** | Header (Usuario, Cerrar sesión), Sidebar (logout visible) | E2E Front: `layout.spec.ts` |

---

## Placeholder o incompleto

| Área | Detalle |
|------|---------|
| **Forgot password – email real** | Flujo actual es mock (mismo mensaje, sin envío de email). Para producción: integrar envío de email y token de reset. |
| **Operaciones – BD** | GET /operaciones devuelve estructura fija (agenda, visitas, revisión, tienda). Opcional: persistir en BD. |

---

## Tests añadidos en esta revisión

- **E2E API** `objetivos.spec.ts`: PATCH objective, POST/DELETE assignments (persistencia).
- **E2E API** `auth.spec.ts`: POST /auth/forgot-password 200 (mismo mensaje para cualquier email).
- **E2E Front** `objetivos-terminales-flows.spec.ts`: Activar, Guardar configuración (flujo completo).
- **E2E Front** `layout.spec.ts`: Header (Usuario, Cerrar sesión), Sidebar (logout visible).
- **Unit** `dashboard.test.ts`: createTerminalAssignment, deleteTerminalAssignment.

---

## Checklist de entrega (revisar antes de entregar a cliente)

- [ ] Login, refresh token, logout y rutas protegidas funcionan.
- [ ] Objetivos terminales: activar, editar meta, guardar configuración, asignaciones departamentos (añadir/eliminar) persistentes.
- [ ] Fichajes: dashboard, clock-in/out (y pause/resume si se usan).
- [ ] Alertas y operaciones devuelven datos (alertas desde BD; operaciones estructura).
- [ ] Forgot password: flujo mock implementado y probado (mismo mensaje; sin email).
- [ ] Header y Sidebar: Servicio técnico, Usuario, Cerrar sesión, nombre visible (E2E layout.spec.ts).
- [ ] Tests: `pnpm test` y `pnpm test:e2e` pasan; cobertura suficiente en áreas críticas.
- [ ] Variables de entorno y secrets documentados (no commitear claves).
- [ ] README / docs con instrucciones de despliegue y pruebas.

## Plan de implementación para entrega

Plan detallado (pasos, código de ejemplo, tests y checklist) para implementar todas las funcionalidades y tests faltantes: **[PLAN_ENTREGA_CLIENTE.md](./PLAN_ENTREGA_CLIENTE.md)**.
