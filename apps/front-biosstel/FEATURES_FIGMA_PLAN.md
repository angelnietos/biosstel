# Plan: implementar diseños Figma y cerrar features

Objetivo: ir cerrando pantallas placeholder con layout y estilo Figma, y funcionalidad cuando el backend exista.

---

## Estado por área

### ✅ Con layout y datos (ajustar solo detalles de estilo)
- **Inicio** – DashboardHomePage, cards objetivos, alertas
- **Objetivos Terminales** – TerminalObjectivesPage (progreso, asignaciones departamento/personas)
- **Niveles de objetivos** – Niveles + DashboardFilters + ObjectiveCard
- **Fichajes – Control de jornada** – ControlJornada (ClockArc, tareas, historial)
- **Usuarios** – UsersDashboard, AddUser, AddClient (modales)
- **Alertas** – AlertsDashboard + AlertsTable (filtros + tabla)
- **Login, Forgot password, Email send, Verify account**

### 🟡 Parcial (pendiente de cerrar)
- Ninguno; todas las pantallas del plan están cerradas con layout Figma.

### 🔴 Rutas sin contenido útil
- Inventario, Reports, Clock (si existen y son solo redirect/placeholder)

### ✅ Productos
- **Productos** – Listado con título, tabla (Código/Referencia, Nombre, Familia, Estado, Acciones), empty state, CTA "Añadir producto" e "Ir al Inventario"

---

## Prioridad de implementación (Figma + cierre de feature)

1. **Objetivos**
   - [x] **Plantillas** – Layout: título, card "Cargar plantilla" (botón/archivo), tabla plantillas (vacía), "Descargar plantilla ejemplo"
   - [x] **Asignación departamentos** – Misma estructura que Objetivos Terminales (cards por departamento) con estado vacío
   - [x] **Asignación personas** – Listado por usuario con estado vacío
   - [x] **Histórico** – Selector de mes + card con mensaje "Datos del mes" (vacío hasta tener API)

2. **Empresa**
   - [x] **Departamentos** – Título, tabla (vacía) + botón "Añadir departamento", columnas Nombre / Color / Acciones
   - [x] **Centros de trabajo** – Listado + "Añadir centro"
   - [x] **Cuentas contables** – Listado + "Añadir cuenta"

3. **Fichajes**
   - [x] **Horarios** – Título, cards de horarios (ej. Horario A1, L-V) con estado vacío
   - [x] **Calendario laboral** – Calendario o lista de festivos + "Añadir festivo"
   - [x] **Fichaje manual** – Formulario entrada/salida (usuario, fecha, hora)
   - [x] **Permisos** – Lista de ausencias (baja, vacaciones, cita) con estado vacío
   - [x] **Geolocalización** – Mensaje informativo o mapa placeholder

4. **Operaciones**
   - [x] **Comercial visitas** – Listado visitas/nuevo/seguimiento + tabla vacía + CTA
   - [x] **Telemarketing agenda** – Lista tareas + anotaciones (vacía) + CTA
   - [x] **Backoffice revisión** – Lista contratos pendientes (vacía) + CTA
   - [x] **Tienda ventas** – Objetivos punto de venta (vacío) + CTA

5. **Alertas**
   - [x] **Alertas ventas** – Tabla vacía + empty state + CTA
   - [x] **Recordatorios** – Lista "Recuerda fichar" (vacía) + CTA
   - [x] **Tracking alerts** – Lista "Fichaje fuera de horario" / inactividad GPS (vacía) + CTA

6. **Usuarios**
   - [x] **Detalle usuario** – Ficha con datos usuario + pestañas (datos, documentación)
   - [x] **Documentación** – Lista de archivos (nóminas, contratos) + subir
   - [x] **Configuración perfil** – Formulario contraseña, teléfono, cuentas contables

---

## Criterios por pantalla (Figma)

- **Título** – `Heading level={1}` o h1, color #080808, peso bold
- **Cards** – Card con `p-5 shadow-sm`, borde #ECEBEB, radius 12px
- **Botones** – Primary (negro/azul Figma), Secondary (borde gris)
- **Tablas** – Cabecera gris, filas con borde sutil, texto #080808 / #B6B6B6
- **Empty state** – Texto gris + CTA "Añadir…" o "Cargar…"
- **Espaciado** – Stack gap={4} o gap={6} entre secciones

Implementar en este orden y marcar [x] en el plan al cerrar cada pantalla.
