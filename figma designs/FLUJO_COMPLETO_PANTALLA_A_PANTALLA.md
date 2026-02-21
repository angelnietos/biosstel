# Flujo completo – Pantalla a pantalla (Figma)

Documento único que describe el **flujo completo** de la aplicación según los diseños de las carpetas **figma** y **figma2** (incl. figma3 y figma4), pantalla por pantalla.

---

## 1. Navegación global (Sidebar)

**Origen:** `figma/plan_ajuste_diseño_sidebar.md`

- **Logo** Biosstel en la parte superior.
- **Items de navegación:** Inicio, Fichajes, Usuarios, Objetivos, Productos, Resultados (iconos SVG: Home, Clock, Users, Chart, Cube, etc.).
- **Estado activo:** fondo azul redondeado (rounded-xl) para el ítem seleccionado.
- **Cierre de sesión:** icono Logout al final del sidebar.
- **Ancho** del sidebar según Figma; opción colapsado/expandido si aplica.

---

## 2. Autenticación

### 2.1 Iniciar sesión (escritorio / móvil)

**Origen:** `figma2/figma4` – App.png (móvil); lógica aplicable a escritorio.

| Elemento | Descripción |
|----------|-------------|
| Título | "Iniciar sesión" |
| Campos | Nombre de usuario, Contraseña (icono ojo mostrar/ocultar) |
| Enlace | "Olvidé mi contraseña" |
| Acción | Botón **Iniciar sesión** |

### 2.2 Olvidé mi contraseña / Verificación / Email enviado

Flujos estándar de recuperación y verificación de cuenta; contrastar con pantallas existentes en la app si hay diseños en Figma.

---

## 3. Inicio (Home)

**Origen:** `figma2/README_FIGMA.md` – Base-10, Base-13, Base-15, Base-18.

### 3.1 Inicio con filtros y empty state

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Inicio filtros + objetivos + alertas | Base-10, Base-18 | Filtros: Marca, hoy/mes, Departamentos, Centros de trabajo, Usuarios, Familia, Subfamilia, Productos, Estado. Cards objetivos (Producto nuevo, Terminales, Actos comerciales). Bloque **Fichar entrada** (arco + botón). Mensaje empty: "Primero se ha de filtrar ↑ para mostrar los datos posteriormente ↓". Tabla **Alertas** (Usuario, Email, Centro de trabajo, Rol, Status). |
| Inicio con datos | Base-13 | Mismos filtros; cards con Logrado/Objetivo y barras (Terminales, Familia Y, Producto X); tabla Alertas con datos. |

### 3.2 Inicio con reloj en estado “fuera de horario” y agenda

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Control jornada en página Inicio | Base-15 | Reloj **rojo** "Ficho mal fuera de horario"; botones Pausar jornada / Fichar salida. **Agenda (tareas pendientes)**. Objetivos tienda / Objetivos personales. |

**Criterios:** Fichar entrada solo para roles que fican (admin no ficha). Empty state cuando no hay filtro aplicado.

---

## 4. Fichajes

**Origen:** `figma2/README_FIGMA.md` (Base-11), `figma2/figma4/` (Base, Base-1, Base-5, Base-12, Base-15, Base-25, Base-34).

### 4.1 Listado principal Fichaje (dashboard)

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Fichaje con tabs | Base, Base-1, Base-5 | Título "Fichaje". **Filtros**, fechas (hoy/mes actual). Botones: **Añadir Calendario laboral +**, **Crear horario +**, **Crear Permiso +**. Tabs: **Listado Calendarios laborales** / **Listado Horarios laborales** / **Listado Permisos**. Tabla: Usuario (icono reloj verde/rojo), Horas fichadas, Horas acumuladas, Departamento, Última localización (coords + hora), % Total horas/semana, % Horas mes, % Año (barras verde/rojo/naranja). Paginación. |

### 4.2 Control de jornada (página dedicada)

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Gestión de jornada | Base-11 | Título "Inicio" o "Gestión de jornada". **Fichar entrada** (arco gris + botón). **Agenda (tareas pendientes)** (horario, tarea, descripción). **Objetivos** (circular 10/12 Nivel 1 Terminales, etc.). Enlace "Ver listado de fichajes →". |

Visible solo para roles que fican; admin redirige o ve mensaje de no acceso.

### 4.3 Modales Fichaje

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Crear calendario | Base-12 | Título "Crear calendario", icono, botón X (placeholder/en construcción). |
| Listado Horarios laborales (consultivo) | Base-15 | Etiqueta "Listado meramente consultivo". Título "Horarios laborales". Tabla: Nombre horario, No. horas laborales, Vacaciones, Días libre disposición, Horas/día L-V, Horas/día Sábado, Horas/semana. |
| Nuevo Horario laboral | Base-25 | Título "Nuevo Horario laboral". Campos: Nombre del horario laboral, No. de horas anuales, Vacaciones (días laborales), Días de libre disposición, Horas por día L-V, Horas por día Sábado, Horas por semana. **Cancelar** / **Crear**. |
| Nuevo Permiso | Base-34 | Título "Nuevo Permiso". Campo **Nombre del permiso**. **Tipo:** botones "Retribuido +" / "No retribuido +". **Cancelar** / **Crear**. |

**Flujo:** Inicio → Fichajes (listado) → [Fichar entrada → Control de jornada] o [Añadir Calendario / Crear horario / Crear Permiso] → modales correspondientes.

---

## 5. Usuario/as

**Origen:** `figma2/figma3/` – Base, Base-1, Base-2, Base-5, Base-10, Base-15, Base-20.

### 5.1 Listado Usuario/as

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Listado completo | Base, Base-1, Base-2 | Título "Usuario/as". Buscador: "Buscador de los elementos contenidos en la tabla". Filtros: Departamento, Centro de Trabajo, Usuario/as, Estado (Activos / No activos). Botones: **Añadir Usuario +**, **Añadir Punto de venta +**, **Añadir Departamento +**. Tabla: Usuario, Departamento, Centro de trabajo, Rol (badges), Status (icono reloj verde/rojo). Cabecera ordenable; filas tipo card; paginación (1 2 3 … > 50). Callout de estado cuando aplique (ej. "Aparece que no ha fichado..."). |

### 5.2 Modales Usuario/as

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Añadir Usuario (completo) | Base-5 | Nombre Usuario, Contraseña (x2), Rol (dropdown), Nombre Apellidos, Identificación fiscal, Dirección, Teléfono personal/empresa, Fecha alta, Fecha baja (callout: "Sólo se rellena si se va a dar de baja al usuari@"), Centro de trabajo (tags). **Cancelar** / **Añadir**. |
| Añadir Usuario (coordinador) | Base-10 | Aviso rosa permisos (SuperAdmin + Coordinador solo edita usuari@s creados). Centro de trabajo y Departamento (tags). No. de cuenta, Calendario laboral, Horario laboral. Sección **Usuarios en otras plataformas** (Usuario, Contraseña, **Añadir Nombre de Usuario/a +**). **Cancelar** / **Añadir**. |
| Añadir Departamento | Base-15 | Código, Nombre departamento, Responsable (dropdown), Fecha alta, Fecha baja. **Cancelar** / **Añadir**. |

### 5.3 Detalle Usuario – Documentación

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Detalle Usuario | Base-20 | Flecha atrás + título "Detalle Usuario". **Añadir Documentación +**. Buscador (Q). Lista documentos: nombre archivo, icono descargar, icono eliminar. Anotación "Click se visualiza". |

**Flujo:** Usuario/as (listado) → Ver detalle → Documentación / Configuración; o Añadir Usuario / Añadir Departamento / Añadir Punto de venta desde listado.

---

## 6. Objetivos

**Origen:** `figma2/README_FIGMA.md` – Base, Base-1 a Base-3, Base-7 a Base-9, Base-12.

### 6.1 Objetivos Terminales (Familia X)

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Objetivos Familia / Terminales | Base, Base-7, Base-8, Base-9, Base-12 | Título, editar, Desactivar. Tabs **Contratos** / **Puntos**. Logrado/Objetivo (barras, valores). **Asignaciones departamento** (Comercial, Depto 2, Tienda; Todas/Selección, Total, Centro de trabajo, Plantilla Objetivos). **Asignaciones personas** (nombres, 00/00). Flechas periodo, **Nuevo objetivo +**. |
| Modal Desactivar Objetivo | Base-1, Base-2 | Confirmación: "Desactivar Objetivo" (icono rojo). Mensaje: desaparece de Departamentos y Usuario/as. **Desactivar** / **Cancelar**. |
| Objetivo inactivo/histórico | Base-3 | Botón "→ Activar", mensaje rosa inactivo/histórico; asignaciones. |

### 6.2 Nuevo producto / Objetivos producto

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Nuevo producto | Base-5, Base-6 | **Añadir Departamentos +** con dropdown (Todos, Comercial, Departamento X, Tiendas). Empty state: "Por favor añade los departamentos...". |
| Modal Subir plantilla | Base-4 | **Subir plantilla**: Cargar documento, **Cancelar**. |

**Flujo:** Objetivos → Terminales (tabs, asignaciones, Desactivar) o Nuevo producto → Añadir Departamentos → Subir plantilla si aplica.

---

## 7. Productos

**Origen:** `figma2` – Base-4, Base-5, Base-6 (Nuevo producto ya cubierto en Objetivos). Resto Base-14 a Base-17, Base-19 a Base-36 para listados y detalle producto según índices de figma2.

- Listados de productos con cabecera tabla y estilos coherentes (bg-table-header, border-card).
- Nuevo producto: formulario + asignaciones departamento + modal Subir plantilla (ver sección 6.2).

---

## 8. Alertas

**Origen:** `figma/plan_ajuste_diseño_alertas.md`, `figma2` Base-10, Base-13, Base-18 (tabla Alertas en Inicio).

### 8.1 Dashboard Alertas (página dedicada)

| Elemento | Descripción |
|----------|-------------|
| Filtros | Grid de dropdowns: Marca, Fecha, Departamentos, etc. |
| Título | "Alertas" sobre la tabla. |
| Tabla | Columnas con iconos de orden (flechas). Rol y Status con paleta Figma. Iconos: "No ha fichado" (reloj rojo con x), "Fichaje fuera de horario" (reloj amarillo). Paginación. |
| Empty state | Card "filter required" cuando no hay filtros seleccionados. |

**Flujo:** Inicio ya incluye tabla Alertas; página Alertas dedicada con filtros y tabla según plan de ajuste.

---

## 9. App móvil

**Origen:** `figma2/figma4` – App.png, App-1.png, App-2, App-3; `figma2/README_FIGMA.md` – App, App-1 a App-18.

### 9.1 Login y dashboard móvil

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Iniciar sesión | App.png | "Iniciar sesión", Nombre de usuario, Contraseña (ojo), "Olvidé mi contraseña", **Iniciar sesión**. Barra navegador biosstel.com. |
| Dashboard | App.png / App-1 | "Bievenid@ Usuario". Card arco + **Fichar entrada**. Registrar visita. Objetivos (circular progress). Bottom nav (Home, Reloj). |

### 9.2 Otras pantallas móvil

| Pantalla | Archivo | Contenido |
|----------|---------|-----------|
| Grabación contrato | App-1 | Formulario "Grabar contrato": Nombre Apellidos, DNI, Dirección, Teléfono personal, Fecha alta. |
| App-2 a App-18 | Varios | Documentar según imágenes para futura app móvil o responsive. |

---

## 10. Resumen de archivos Figma por área

| Área | Carpetas | Archivos clave |
|------|----------|----------------|
| Sidebar | figma | plan_ajuste_diseño_sidebar.md |
| Alertas | figma | plan_ajuste_diseño_alertas.md |
| Inicio, Objetivos, Nuevo producto, Control jornada | figma2 | Base-10, Base-13, Base-15, Base-18; Base, Base-1 a Base-9, Base-11, Base-12; Base-4 a Base-6 |
| Fichaje (listados, modales) | figma2/figma4 | Base, Base-1, Base-5, Base-12, Base-15, Base-25, Base-34 |
| Usuario/as | figma2/figma3 | Base, Base-1, Base-2, Base-5, Base-10, Base-15, Base-20 |
| App móvil | figma2, figma2/figma4 | App.png, App-1.png, App-2 a App-18 |

---

## 11. Orden sugerido de implementación / revisión

1. **Navegación:** Sidebar (figma).
2. **Autenticación:** Login (figma4 App / escritorio).
3. **Inicio:** Filtros, empty state, Fichar entrada, tabla Alertas (figma2 Base).
4. **Fichajes:** Listado con tabs, Control de jornada, modales Crear calendario / Horario / Permiso (figma2 + figma4).
5. **Usuario/as:** Listado, Añadir Usuario, Añadir Departamento, Detalle/Documentación (figma3).
6. **Objetivos:** Terminales (tabs, asignaciones, Desactivar), Nuevo producto, Subir plantilla (figma2).
7. **Alertas:** Página dedicada con filtros y tabla (figma).
8. **Productos:** Listados y detalle (figma2).
9. **App móvil:** Login, Dashboard, flujos específicos (figma4 App).

---

*Documento generado a partir de figma/, figma2/, figma2/figma3/ y figma2/figma4/. Mantener alineado con README y PLAN de cada carpeta origen.*
