# Referencia Figma (figma2)

Índice de pantallas para alinear la app con el diseño. Todas las vistas deben cerrarse según estos referentes.

**Otras carpetas:**  
- **figma3** – Usuario/as (listado, filtros, Añadir Usuario, modal): `figma3/README_FIGMA.md`, `figma3/PLAN_FIGMA.md`  
- **figma4** – Fichaje (listados calendarios/horarios/permisos, tabla horas) y App móvil (login, dashboard): `figma4/README_FIGMA.md`, `figma4/PLAN_FIGMA.md`

---

## App (vista móvil)

| Archivo   | Contenido |
|-----------|-----------|
| App.png   | Dashboard: "Bievenid@ Usuario", arco + Fichar entrada, Registrar visita, Objetivos (circular progress), bottom nav |
| App-1.png | Formulario "Grabar contrato": Nombre Apellidos, DNI, Dirección, Teléfono personal, Fecha alta |
| App-2 a App-18 | Otras pantallas móvil |

---

## Base (vista escritorio)

### Inicio (Home)

| Archivo   | Contenido |
|-----------|-----------|
| Base-10.png | Inicio: filtros (Marca, hoy/mes, Departamentos, Centros, Usuarios, Productos), cards objetivos (Producto nuevo, Terminales, Actos comerciales, Producto X), **Fichar entrada** (arco + botón), tabla **Alertas** (Usuario, Email, Centro de trabajo, Rol, Status) |
| Base-13.png | Inicio: filtros (Familia, Subfamilia, Productos, Estado), cards con Logrado/Objetivo y barras (Terminales, Familia Y, Familia, Producto X), tabla **Alertas** con datos (Usuario, Departamento, Centro de trabajo, Rol, Status) |
| Base-15.png | Inicio: reloj **rojo** "Ficho mal fuera de horario", Pausar jornada / Fichar salida, **Agenda (tareas pendientes)**, Objetivos tienda / Objetivos personales |
| Base-18.png | Inicio: filtros, mensaje "Primero se ha de filtrar ↑ para mostrar los datos posteriormente ↓", Fichar entrada, tabla Alertas (Usuario, Email, Centro de trabajo, Rol, Status) |

### Objetivos Terminales

| Archivo   | Contenido |
|-----------|-----------|
| Base.png  | Objetivos Familia X: título, editar, Desactivar, tabs Contratos/Puntos, Logrado/Objetivo, Asignaciones departamento (Comercial, Depto 2, Tienda), Asignaciones personas |
| Base-1.png | Objetivos Terminales + **modal "Desactivar Objetivo"** (confirmación: desaparece de Departamentos y Usuario/as) |
| Base-2.png | Igual que Base-1, modal Desactivar |
| Base-3.png | Objetivos Terminales: botón "→ Activar", **mensaje rosa** inactivo/histórico, asignaciones |
| Base-7.png | Objetivos Terminales: tabs Contratos/Puntos, Logrado "- / 50,000", Asignaciones departamento (listado centros), Asignaciones personas (nombres 00/00) |
| Base-8.png | Objetivos Terminales: Guardar cambios, cards Comercial/Departamento 2/Tienda (Todas/Selección, Total, Centro de trabajo, Plantilla Objetivos), Asignaciones personas (misma estructura) |
| Base-9.png | Objetivos Terminales: Desactivar resaltado, progreso 20,000/89,988, 15%, asignaciones |
| Base-12.png | Objetivos Terminales: flechas periodo, "Nuevo objetivo +", anotaciones diseño, asignaciones departamento/personas |

### Nuevo producto / Objetivos producto

| Archivo   | Contenido |
|-----------|-----------|
| Base-4.png | Nuevo producto + **modal "Subir plantilla"** (Cargar documento, Cancelar) |
| Base-5.png | Nuevo producto: **"Añadir Departamentos +"** con dropdown (Todos, Comercial, Departamento X, Tiendas) |
| Base-6.png | Nuevo producto: empty state "Por favor añade los departamentos...", botón **Añadir Departamentos +** |

### Control de jornada / Fichajes (Inicio con reloj)

| Archivo   | Contenido |
|-----------|-----------|
| Base-11.png | Inicio: título Inicio, **Fichar entrada** (arco gris + botón), **Agenda (tareas pendientes)** (horario 12:00-12:40, Tarea, descripción), **Objetivos** (circular 10/12 Nivel 1 Terminales, etc.) |

### Resto Base

| Archivo   | Contenido |
|-----------|-----------|
| Base-14 a Base-17, Base-19 a Base-36 | Variantes de Objetivos, listados, detalle producto, etc. |

---

## Componentes sueltos

- **Card.png, Card-1.png, Card-2.png**: estilos de card
- **Arrow, Union, Line, Text, Ellipse, Vector**: iconos y formas

---

## Criterios Figma (resumen)

- **Título**: `Heading level={1}`, color #080808 (gray-900), bold
- **Cards**: p-5 shadow-sm, borde #ECEBEB (border-card), radius 12px
- **Tablas**: cabecera gris (bg-table-header), filas borde sutil, texto gray-900 / muted
- **Empty state**: texto gris + CTA
- **Fichar entrada**: arco (gris/verde/rojo según estado), botón negro "Fichar entrada"
- **Alertas**: columnas Usuario, Email (opcional), Centro de trabajo, Rol, Status
- **Modales**: Desactivar Objetivo (icono rojo, título, mensaje, botón Desactivar, Cancelar); Subir plantilla (Cargar documento, Cancelar)

---

## Uso

Al cerrar una vista, contrastar con el archivo correspondiente de esta carpeta y aplicar los criterios anteriores.

## Estado de implementación (escritorio)

- **Inicio (Base-10/18):** Filtros, bloque Fichar entrada (arco + botón), empty state “Primero se ha de filtrar ↑…”, tabla Alertas con `bg-table-header` y texto gray-900/muted.
- **Control de jornada (Base-11/15):** Reloj (gris/verde/rojo), estado “Ficho mal fuera de horario” cuando `fueraHorario`, agenda y objetivos en página.
- **Objetivos Terminales (Base, Base-1 a 3):** Tabs Contratos/Puntos, barra Logrado/Objetivo, asignaciones departamento/personas, modal Desactivar con icono rojo, mensaje rosa inactivo.
- **Nuevo producto (Base-4 a 6):** Empty state “Por favor añade los departamentos…”, botón Añadir Departamentos + con dropdown, modal Subir plantilla (Cargar documento, Cancelar).
- **Vistas móvil (App, App-1):** Referencia para futura app móvil o layout responsive; no implementado en esta fase.

## Pulido de estilos y flujos (checklist)

**Estilos aplicados:**
- Botones: `whitespace-nowrap`, `px-5` / `min-h-[43px]`, `shrink-0` en filas de acciones para que el texto no quede apretado.
- Tablas: cabecera con clase `.bg-table-header` (#f9fafb); barras de progreso más visibles (altura 10px, track #d1d5db).
- Cards y bordes: `border-border-card`, `rounded-xl` según criterios Figma.

**Flujos a cerrar por área (revisar que estén completos):**
- **Inicio:** Filtros → datos → Fichar entrada → control jornada; empty state cuando no hay filtro.
- **Fichajes:** Fichar entrada / salida; tabs Calendarios / Horarios / Permisos; modales Añadir Calendario, Crear horario, Crear permiso (ver figma4/PLAN_FIGMA.md).
- **Usuario/as:** Listado → Ver detalle → Documentación / Configuración; Añadir Usuario (modal o página); Añadir Departamento / Punto de venta (ver figma3/PLAN_FIGMA.md).
- **Objetivos:** Terminales (tabs, asignaciones, Desactivar); Inicio (cards objetivos, alertas).
- **Productos / Nuevo producto:** Formulario + Asignaciones departamento + Subir plantilla.
- **Alertas, Operaciones, Empresa, etc.:** Listados con cabecera tabla y acciones coherentes con el resto.
