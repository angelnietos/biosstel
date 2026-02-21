# Referencia Figma (figma4) – Fichaje y App móvil

Índice de pantallas para alinear la app con el diseño de **Fichaje** (listados, calendarios, horarios, permisos) y vistas **App** (móvil). Todas las vistas deben cerrarse según estos referentes.

---

## App (vista móvil)

| Archivo   | Contenido |
|-----------|-----------|
| App.png   | **Iniciar sesión**: título "Iniciar sesión", Nombre de usuario, Contraseña (icono ojo mostrar/ocultar), "Olvidé mi contraseña", botón **Iniciar sesión**; barra navegador biosstel.com |
| App-1.png | **Dashboard móvil**: "Bievenid@ Usuario", card con arco/reloj y botón **Fichar entrada**, barra inferior (Home, Reloj) |
| App-2.png, App-3.png | Otras pantallas móvil (revisar imagen para detalle) |

---

## Base (vista escritorio) – Fichaje

### Listado principal Fichaje (tabs)

| Archivo   | Contenido |
|-----------|-----------|
| Base.png  | **Fichaje**: título, **Filtros**, fechas (hoy/mes actual/26), botones **Añadir Calendario laboral +**, **Crear horario +**, **Crear Permiso +**, tabs **Listado Calendarios laborales** (activo) / **Listado Horarios laborales** / **Listado Permisos**, tabla (Usuario con icono reloj verde/rojo, Horas fichadas, Horas acumuladas, Departamento, Última localización con coords + hora clicable, % Total horas/semana, % Horas mes, % Año con barras verdes/rojas/naranjas), paginación |
| Base-1.png | Igual con tab **Listado Horarios laborales** activo |
| Base-5.png | Igual; botón "Añadir Calendario laboral +" resaltado/foco; Última localización con indicador (flecha) |
| Base-2 a Base-4, Base-6 a Base-11 | Variantes de listados (tab activo, filtros, misma tabla) |

### Modales Fichaje

| Archivo    | Contenido |
|------------|-----------|
| Base-12.png | **Modal "Crear calendario"**: título "Crear calendario", icono, botón X cerrar (placeholder / en construcción) |
| Base-15.png | **Vista/modal "Horarios laborales"**: etiqueta "Listado meramente consultivo", título "Horarios laborales", tabla (Nombre horario, No. horas laborales, Vacaciones (días laborales), Días libre disposición (días laborales), Horas por día L-V, Horas por día Sábado, Horas por semana), filas tipo card, scroll |
| Base-25.png | **Modal "Nuevo Horario laboral"**: icono, título "Nuevo Horario laboral", campos: Nombre del horario laboral, No. de horas anuales, Vacaciones (días laborales), Días de libre disposición (días laborales), Horas por día Lunes-Viernes, Horas por día Sábado, Horas por semana; **Cancelar** / **Crear** |
| Base-34.png | **Modal "Nuevo Permiso"**: icono (check), título "Nuevo Permiso", **Nombre del permiso** (input), **Tipo**: botones "Retribuido +" / "No retribuido +"; **Cancelar** / **Crear** |

### Resto Base (listados y formularios)

| Archivo   | Contenido |
|-----------|-----------|
| Base-13, Base-14, Base-16 a Base-24 | Listados consultivos, modales crear/editar calendario u horario (revisar imagen) |
| Base-26 a Base-33, Base-35 a Base-40 | Permisos, variantes formularios, configuraciones (revisar imagen) |

---

## Componentes sueltos (figma4)

- **image 34.png, image 36.png, image 37.png**: imágenes de referencia
- **Arrow 11, 13, 14, 39–42**: flechas
- **Line 23.png, Text.png, Vector 185.png**: iconos y formas

---

## Criterios Figma (resumen)

- **Título**: "Fichaje" en `Heading level={1}`, color gray-900, bold
- **Filtros y fechas**: botón Filtros + campos fecha (hoy/mes)
- **Acciones**: Añadir Calendario laboral +, Crear horario +, Crear Permiso +
- **Tabs**: Listado Calendarios laborales | Listado Horarios laborales | Listado Permisos
- **Tabla principal**: cabecera gris (bg-table-header); Usuario (icono reloj verde/rojo), Horas fichadas, Horas acumuladas, Departamento (badges), Última localización (coords + hora, clicable), columnas % con barras (verde ≤100%, rojo >100% o bajo, naranja muy bajo)
- **Filas**: tipo card con borde sutil
- **Modal Crear calendario**: título, X (Base-12)
- **Modal Nuevo Horario laboral**: campos indicados; Cancelar / Crear (Base-25)
- **Modal Nuevo Permiso**: nombre, tipo Retribuido + / No retribuido +; Cancelar / Crear (Base-34)
- **App móvil**: Login (usuario, contraseña, Olvidé mi contraseña); Dashboard "Bievenid@ Usuario" + Fichar entrada (arco + botón)

---

## Uso

Al cerrar una vista de Fichaje o una pantalla móvil, contrastar con el archivo correspondiente de esta carpeta y aplicar los criterios anteriores.

## Estado de implementación

- **Listado Fichaje**: página Fichaje con título, Filtros, fechas, tres botones, tabs (enlace o estado a calendarios/horarios/permisos), tabla con columnas y barras % — alinear con Base, Base-1, Base-5. Rutas existentes: `/fichajes`, `/fichajes/calendario-laboral`, `/fichajes/horarios`, `/fichajes/permisos`.
- **Modal Crear calendario**: placeholder (Base-12) desde "Añadir Calendario laboral +".
- **Modal Nuevo Horario laboral**: formulario Base-25 desde "Crear horario +".
- **Modal Nuevo Permiso**: formulario Base-34 desde "Crear Permiso +".
- **Listado Horarios laborales**: vista consultiva Base-15 (tabla con columnas indicadas).
- **App móvil**: login (App.png) y dashboard "Bievenid@ Usuario" + Fichar entrada (App-1) — pendiente o responsive.
