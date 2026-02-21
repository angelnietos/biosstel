# Plan Figma – figma4 (Fichaje y App móvil)

## Objetivo

Alinear las vistas de **Fichaje** (escritorio) y las pantallas **App** (móvil) con los diseños de la carpeta `figma4` (Base.png a Base-40, App.png a App-3).

## Alcance

### Escritorio (Base)

- **Dashboard Fichaje**: título "Fichaje", Filtros, fechas (hoy/mes), tres botones (Añadir Calendario laboral +, Crear horario +, Crear Permiso +), tabs (Listado Calendarios laborales, Listado Horarios laborales, Listado Permisos), tabla con columnas de horas y % con barras de progreso.
- **Modales**: Crear calendario (Base-12), Nuevo Horario laboral (Base-25), Nuevo Permiso (Base-34); listado consultivo Horarios laborales (Base-15).

### Móvil (App)

- **App.png**: Login (Iniciar sesión, usuario, contraseña, Olvidé mi contraseña).
- **App-1**: Dashboard "Bievenid@ Usuario" + Fichar entrada (arco + botón) + bottom nav (Home, Reloj).
- **App-2, App-3**: Documentar y planificar.

## Tareas

### 1. Listado Fichaje (Base, Base-1, Base-5)

- [ ] Título "Fichaje", botón Filtros y dos campos fecha (hoy/mes).
- [ ] Tres botones: Añadir Calendario laboral +, Crear horario +, Crear Permiso +.
- [ ] Tabs: Listado Calendarios laborales | Listado Horarios laborales | Listado Permisos (activar según ruta o estado).
- [ ] Tabla: Usuario (icono reloj verde/rojo), Horas fichadas, Horas acumuladas, Departamento (badges), Última localización (coords + hora, enlace si aplica), % Total horas/semana, % Horas mes, % Año (barras verde/rojo/naranja según valor).
- [ ] Cabecera `bg-table-header`; filas tipo card; paginación (1 2 3 … > 50).

### 2. Modal Crear calendario (Base-12)

- [ ] Título "Crear calendario", icono, botón X. (Placeholder / en construcción.)

### 3. Listado Horarios laborales – consultivo (Base-15)

- [ ] Etiqueta "Listado meramente consultivo".
- [ ] Título "Horarios laborales", tabla: Nombre horario, No. horas laborales, Vacaciones (días laborales), Días libre disposición, Horas/día L-V, Horas/día Sábado, Horas/semana.
- [ ] Filas tipo card; scroll si hay muchos registros.

### 4. Modal Nuevo Horario laboral (Base-25)

- [ ] Título "Nuevo Horario laboral", icono, X.
- [ ] Campos: Nombre del horario laboral, No. de horas anuales, Vacaciones (días laborales), Días de libre disposición (días laborales), Horas por día Lunes-Viernes, Horas por día Sábado, Horas por semana.
- [ ] Botones Cancelar y Crear.

### 5. Modal Nuevo Permiso (Base-34)

- [ ] Título "Nuevo Permiso", icono (check), X.
- [ ] Campo "Nombre del permiso".
- [ ] Tipo: dos botones "Retribuido +" y "No retribuido +".
- [ ] Botones Cancelar y Crear.

### 6. Vistas App (móvil)

- [ ] **App.png**: pantalla Iniciar sesión (campos, Olvidé mi contraseña, botón Iniciar sesión).
- [ ] **App-1**: dashboard "Bievenid@ Usuario", card Fichar entrada (arco + botón), navegación inferior (Home, Reloj).
- [ ] **App-2, App-3**: revisar imágenes y documentar en README; planificar implementación (responsive o ruta móvil).

### 7. Criterios globales

- [ ] Tokens del theme: border-card, gray-900, muted, bg-table-header.
- [ ] Coherencia con figma2 y figma3 (cards, tablas, modales).

## Índice de archivos Figma (resumen)

| Archivo   | Vista / componente |
|-----------|--------------------|
| Base, Base-1, Base-5 | Listado Fichaje (tabs + tabla) |
| Base-12   | Modal Crear calendario |
| Base-15   | Listado Horarios laborales (consultivo) |
| Base-25   | Modal Nuevo Horario laboral |
| Base-34   | Modal Nuevo Permiso |
| Base-2–4, 6–11, 13–14, 16–24, 26–33, 35–40 | Variantes listados y formularios |
| App, App-1, App-2, App-3 | Móvil: login, dashboard, otras |

## Referencias

- Índice detallado: `README_FIGMA.md` en esta carpeta.
- Criterios Figma globales: `figma2/README_FIGMA.md`.
- Código: `libs/frontend/features/fichajes/` (FichajeDashboard, ControlJornada, Horarios, CalendarioLaboral, Permisos, etc.), rutas en `libs/frontend/shell/routeRegistry.tsx`, auth/login si aplica.
