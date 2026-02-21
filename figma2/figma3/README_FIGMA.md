# Referencia Figma (figma3) – Usuario/as

Índice de pantallas para alinear la app con el diseño de **Usuario/as** (listado, filtros, añadir usuario, detalle, etc.). Todas las vistas deben cerrarse según estos referentes.

---

## Base (vista escritorio)

### Listado Usuario/as

| Archivo   | Contenido |
|-----------|-----------|
| Base.png  | **Usuario/as**: título, buscador ("Buscador de los elementos contenidos en la tabla"), filtros (Departamento, Centro de Trabajo, Usuario/as, Estado — etiqueta "Activos / No activos (los que tienen fecha de baja)"), botones **Añadir Usuario +**, **Añadir Punto de venta +**, **Añadir Departamento +**, tabla (Usuario, Departamento, Centro de trabajo, Rol con badges, Status con icono reloj verde/rojo), paginación |
| Base-1.png | Misma vista con sidebar colapsado; callout de estado (ej. "Aparece que no ha fichado de primeras, pues aún no ha entrado a su perfil"); indicador rojo en centro de trabajo; iconos estado verde/rojo |
| Base-2.png | Listado con cabecera tabla ordenable (flechas), filas tipo card, Rol (pills Comercial/Telemarketing/Tienda), Status (reloj verde/rojo), paginación 1 2 3 … > 50 |

### Modales: Añadir Usuario (variantes)

| Archivo    | Contenido |
|------------|-----------|
| Base-10.png | **Modal "Añadir Usuario"** (versión coordinador): aviso rosa (SuperAdmin + Coordinador solo edita usuari@s creados, 1 día), Centro de trabajo (tag Las Arenas), Departamento (tag Comercial), No. de cuenta, Calendario laboral, Horario laboral, sección **Usuarios en otras plataformas** (Usuario, Contraseña, **Añadir Nombre de Usuario/a +**), Cancelar / **Añadir** |
| Base-5.png  | **Modal "Añadir Usuario"** (formulario completo): Nombre Usuario, Contraseña (x2), Rol (dropdown Comercial), Nombre Apellidos, Identificación fiscal, Dirección, Teléfono personal, Teléfono empresa, Fecha alta, Fecha baja (callout rosa: "Sólo se rellena si se va a dar de baja al usuari@"), Centro de trabajo (tags Las Arenas, Castro removibles), Cancelar / **Añadir** |

### Modal Añadir Departamento

| Archivo    | Contenido |
|------------|-----------|
| Base-15.png | **Modal "Añadir Departamento"**: Código, Nombre departamento, Responsable (dropdown), Fecha alta, Fecha baja (dd/mm/aaaa), **Cancelar** / **Añadir** |

### Detalle Usuario (documentación)

| Archivo    | Contenido |
|------------|-----------|
| Base-20.png | **Modal "Detalle Usuario"**: flecha atrás + título "Detalle Usuario", botón **Añadir Documentación +**, buscador (Q), lista de documentos (nombre archivo, icono descargar, icono eliminar), anotación "Click se visualiza" |

### Resto Base (listado y variantes)

| Archivo   | Contenido |
|-----------|-----------|
| Base-3, Base-4, Base-6 a Base-9 | Variantes listado (filtros Filtros / Departamento / Puntos de venta / Usuarios), tabla con Status (verde/rojo), email, rol, paginación |
| Base-11 a Base-14, Base-16 a Base-19, Base-21 a Base-25 | Detalle usuario, configuración, puntos de venta u otras variantes de formularios/modales (revisar imagen si se necesita detalle) |

---

## Componentes sueltos (figma3)

- **Arrow 6.png, Arrow 7.png**: flechas
- **Frame 1321319912.png, Line 22.png, Text.png, Vector 184.png**: iconos y formas

---

## Criterios Figma (resumen)

- **Título**: "Usuario/as" en `Heading level={1}`, color #080808 (gray-900), bold
- **Tabla**: cabecera gris (bg-table-header), cabeceras ordenables (flechas), filas tipo card (border-card, rounded-xl), texto gray-900 / muted
- **Rol**: badges/pills (Comercial, Telemarketing, Tienda) con colores distintos
- **Status**: icono reloj verde (activo/OK) o rojo (inactivo/atención)
- **Filtros**: Buscador + dropdowns Departamento, Centro de Trabajo, Usuario/as, Estado (activos/no activos)
- **Botones**: Añadir Usuario +, Añadir Punto de venta +, Añadir Departamento +
- **Modal Añadir Usuario**: aviso permisos (fondo rosa); campos según variante (Base-5: formulario completo; Base-10: centro/departamento, cuenta, calendario/horario, Usuarios otras plataformas); Cancelar / Añadir
- **Modal Añadir Departamento**: Código, Nombre departamento, Responsable, Fecha alta/baja; Cancelar / Añadir
- **Detalle Usuario**: Añadir Documentación +, buscador, lista documentos (descargar, eliminar), "Click se visualiza"
- **Callout estado**: mensaje contextual (ej. no ha fichado) junto a icono estado

---

## Uso

Al cerrar una vista de Usuario/as, contrastar con el archivo correspondiente de esta carpeta y aplicar los criterios anteriores.

## Estado de implementación

- **Listado**: UserList con filtros, tabla (bg-table-header, Rol badges, Status reloj), botones Añadir Usuario / Punto de venta / Departamento — alineado con Base, Base-1, Base-2.
- **Modal Añadir Usuario**: AddUserForm con aviso rosa y campos; completar variante formulario completo (Base-5) si se requiere.
- **Modal Añadir Departamento**: Implementar según Base-15 (Código, Nombre, Responsable, Fechas).
- **Detalle Usuario**: Documentación con lista de documentos, Añadir Documentación +, buscador — alineado con Base-20.
- **Callout estado**: Mostrar mensaje contextual junto a Status cuando aplique (Base-1).
