# Pendientes – Biosstel

Listado único de lo que **sigue pendiente** según [PLAN_FLUJOS_COBERTURA.md](./PLAN_FLUJOS_COBERTURA.md) y los planes por capa. Actualizar al cerrar cada ítem.

---

## Hecho en esta iteración

- **API:** PATCH `/dashboard/terminal-objectives/:id` con `{ isActive: boolean }` (desactivar/activar objetivo terminal).
- **API:** GET `/dashboard/terminal-objectives?type=contratos|puntos&period=YYYY-MM` — periodo opcional para histórico; columna `period` en `terminal_objectives` (NULL = actual, `YYYY-MM` = histórico).
- **API:** POST `/productos/:id/plantilla` (multipart) para subir plantilla; guarda en `uploads/plantillas/`.
- **API:** GET fichaje actual devuelve `fueraHorario?: boolean` (por ahora `false`; se puede calcular después con horarios).
- **API:** CORS permite `localhost:3001` además de `3000` (dev.ts y main.ts).
- **Front:** Objetivos terminales: pestañas Contratos/Puntos con datos distintos por tipo; botón Desactivar/Activar con PATCH, estado `active` derivado de la API, loading en botón; toasts de éxito/error.
- **Front:** Objetivos terminales: «Añadir departamentos» añade tarjetas en sesión; «Guardar configuración» muestra feedback (toast) según haya o no departamentos añadidos; al añadir desde vista detalle se vuelve a la lista.
- **Front:** Objetivos terminales — Histórico: selector de mes llama a la API con `period`; se muestran header + tarjetas del mes o «No hay datos históricos para este mes».
- **Front:** Página Alertas: filtros conectados a GET `/alertas`; «Aplicar filtros» muestra la tabla.
- **Front:** Inicio: bloque Fichar entrada con `currentFichaje` y `fueraHorario`; reloj rojo cuando fuera de horario.
- **Sidebar:** Colapsar/expandir en `Sidebar.tsx`.
- **Tabla Fichaje:** Columnas % con `ProgressBar`.

---

## Pendiente (opcional o siguiente iteración)

### API

| Ítem | Notas |
|------|--------|
| Cálculo real de `fueraHorario` | Comparar hora de fichaje con horario laboral del usuario y devolver `true` cuando corresponda. |

### Frontend

| Ítem | Notas |
|------|--------|
| Nuevo producto: asignaciones departamento + modal Subir plantilla | Conectar asignaciones con API; modal que llame POST `/productos/:id/plantilla` con FormData. |
| Objetivos: subir plantilla desde modal | Enlace al endpoint de plantilla desde el modal ya referenciado en Objetivos. |

### Opcional

- **App móvil:** Login/dashboard responsive o rutas específicas; bottom nav (Home, Reloj).
- **Tests E2E** por flujo crítico.
- **Documentación:** README raíz con scripts y env; enlace a figma designs y planes.

---

## Referencias

- Estado por flujo: [PLAN_FLUJOS_COBERTURA.md](./PLAN_FLUJOS_COBERTURA.md)
- Flujo pantalla a pantalla: [figma designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md](../figma%20designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md)
- Planes por capa: [PLAN_BASE_DE_DATOS.md](./PLAN_BASE_DE_DATOS.md), [PLAN_API.md](./PLAN_API.md), [PLAN_FRONTEND.md](./PLAN_FRONTEND.md)
