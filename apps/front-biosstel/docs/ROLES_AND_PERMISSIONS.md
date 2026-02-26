# Roles y permisos por vista (Figma)

Definición de roles y qué vistas puede ver cada uno. La configuración está en `libs/frontend/platform` (`config/routesPermissions.ts`, `constants/roles.ts`).

**Plan detallado (pantallas + elementos por rol):** ver `docs/PLAN_ROLES_Y_ELEMENTOS.md`. Ahí se define qué elementos se muestran u ocultan por rol (ej. Admin no ve "Fichar entrada"; solo ve listado de fichajes y gestión de calendarios/horarios/permisos).

## Roles

| Rol            | Descripción     |
|----------------|-----------------|
| ADMIN          | Administrador. Acceso total. |
| COORDINADOR    | Coordinador. Gestión de usuarios, empresa, objetivos, reportes. |
| TELEMARKETING  | Telemarketing. Inicio, fichajes, objetivos, operaciones (agenda). |
| TIENDA         | Tienda. Inicio, fichajes, objetivos, productos, inventario, operaciones (tienda). |
| COMERCIAL      | Comercial. Inicio, fichajes, objetivos, operaciones (visitas). |
| BACKOFFICE     | Backoffice. Inicio, fichajes, operaciones (revisión), backOffice. |

## Permisos por área (vista / ruta)

- **Inicio** (`/home`, `/resultados`): todos.
- **Fichajes** (`/fichajes/*`, `/clock`): todos.
- **Usuarios** (`/users/*`, `/add-user`, `/add-client`): ADMIN, COORDINADOR.
- **Configuración perfil** (`/configuracion-perfil`): todos.
- **Objetivos** (`/objetivos/*`, `/objetivos-terminales`): ADMIN, COORDINADOR, COMERCIAL, TIENDA, TELEMARKETING.
- **Productos** (`/productos`): ADMIN, COORDINADOR, TIENDA.
- **Inventario** (`/inventory`): ADMIN, COORDINADOR, TIENDA.
- **Reportes** (`/reports`): ADMIN, COORDINADOR.
- **Alertas** (`/alertas/*`): todos.
- **Operaciones**:
  - Comercial visitas: ADMIN, COORDINADOR, COMERCIAL.
  - Telemarketing agenda: ADMIN, COORDINADOR, TELEMARKETING.
  - Backoffice revisión: ADMIN, COORDINADOR, BACKOFFICE.
  - Tienda ventas: ADMIN, COORDINADOR, TIENDA.
- **Empresa** (`/empresa/*`): ADMIN, COORDINADOR.
- **BackOffice** (`/backOffice`): ADMIN, COORDINADOR, BACKOFFICE.

## Comportamiento

1. **Sidebar**: Solo se muestran enlaces a rutas a las que el usuario tiene acceso según su `user.role`.
2. **Acceso directo por URL**: Si el usuario no tiene permiso, se muestra la pantalla "Sin permiso" y un botón para ir al Inicio.
3. **Usuario sin rol**: Si el backend no envía `role`, se permite el acceso a todas las rutas (compatibilidad).
4. **JWT**: Si el token incluye `role` en el payload, se usa al restaurar sesión (AuthRestore).

## Cómo añadir una nueva vista

1. Añadir la ruta en `src/constants/paths.ts` si aplica.
2. En `src/config/routesPermissions.ts`, añadir un elemento en `ROUTE_PERMISSIONS` con `path`, opcionalmente `prefix: true`, y `roles` (array de roles que pueden acceder).
