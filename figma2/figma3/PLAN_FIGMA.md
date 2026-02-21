# Plan Figma – figma3 (Usuario/as)

## Objetivo

Alinear todas las vistas de **Usuario/as** con los diseños de la carpeta `figma3` (Base.png a Base-25.png).

## Alcance

- Listado Usuario/as (tabla, filtros, buscador, botones Añadir Usuario / Punto de venta / Departamento).
- Modal **Añadir Usuario** (dos variantes: Base-5 formulario completo, Base-10 coordinador con Usuarios otras plataformas).
- Modal **Añadir Departamento** (Base-15).
- Modal/página **Detalle Usuario** con documentación (Base-20).
- Estilos: cabecera tabla ordenable, badges Rol, iconos Status (verde/rojo), callouts de estado.

## Tareas

### 1. Listado (Base, Base-1, Base-2)

- [ ] Título "Usuario/as", buscador con placeholder "Buscador de los elementos contenidos en la tabla".
- [ ] Filtros: Departamento, Centro de Trabajo, Usuario/as, Estado (con etiqueta "Activos / No activos (los que tienen fecha de baja)" si aplica).
- [ ] Botones: Añadir Usuario +, Añadir Punto de venta +, Añadir Departamento +.
- [ ] Tabla: columnas Usuario, Departamento, Centro de trabajo, Rol (badges), Status (icono reloj verde/rojo).
- [ ] Cabecera con `bg-table-header` y iconos ordenables (flechas).
- [ ] Filas tipo card (border-card, rounded-xl); paginación (1 2 3 … > 50).
- [ ] Callout de estado cuando aplique (ej. "Aparece que no ha fichado de primeras...").

### 2. Modal Añadir Usuario (Base-5, Base-10)

- [ ] **Variante Base-10**: aviso rosa permisos; Centro de trabajo y Departamento (tags removibles); No. de cuenta; Calendario laboral; Horario laboral; sección "Usuarios en otras plataformas" (Usuario, Contraseña, Añadir Nombre de Usuario/a +); Cancelar / Añadir.
- [ ] **Variante Base-5**: Nombre Usuario, Contraseña x2, Rol, Nombre Apellidos, Identificación fiscal, Dirección, Teléfono personal/empresa, Fecha alta, Fecha baja (callout "Sólo se rellena si se va a dar de baja al usuari@"), Centro de trabajo (tags); Cancelar / Añadir.

### 3. Modal Añadir Departamento (Base-15)

- [ ] Campos: Código, Nombre departamento, Responsable (dropdown), Fecha alta, Fecha baja.
- [ ] Botones Cancelar y Añadir.

### 4. Detalle Usuario – Documentación (Base-20)

- [ ] Título "Detalle Usuario" con flecha atrás.
- [ ] Botón "Añadir Documentación +".
- [ ] Buscador en lista de documentos.
- [ ] Lista: nombre archivo, icono descargar, icono eliminar; anotación "Click se visualiza".

### 5. Criterios globales

- [ ] Tokens del theme: border-card, text-gray-900, text-muted, bg-table-header.
- [ ] Coherencia con figma2 (cards, tablas, modales).

## Índice de archivos Figma

| Archivo   | Vista / componente |
|-----------|--------------------|
| Base, Base-1, Base-2 | Listado Usuario/as |
| Base-5, Base-10      | Modal Añadir Usuario |
| Base-15              | Modal Añadir Departamento |
| Base-20              | Modal Detalle Usuario (documentación) |
| Base-3, 4, 6–9, 11–14, 16–19, 21–25 | Variantes listado / detalle / formularios |

## Referencias

- Índice detallado: `README_FIGMA.md` en esta carpeta.
- Criterios Figma globales: `figma2/README_FIGMA.md`.
- Código: `libs/frontend/features/usuarios/` (UserList, UsersDashboard, AddUserForm, DetalleUsuario, Documentacion, etc.), `libs/frontend/shared/` (nav).
