# Sentry y log de flujo (dev)

## Sentry (monitorización frontend)

- **Uso:** Errores y rendimiento del frontend en producción (o staging) se envían a Sentry si configuras el DSN.
- **Configuración:** Añade en `.env` o en el entorno de despliegue:
  - `NEXT_PUBLIC_SENTRY_DSN` — DSN del proyecto Sentry (frontend). Opcional: si no está definido, Sentry no se inicializa y el build sigue igual.
  - `SENTRY_DSN` — Para el servidor (opcional).
- **Build:** Si no defines ningún DSN, el build no usa Sentry. Si defines DSN, `withSentryConfig` envía source maps (en producción conviene restringir acceso).

## Log de flujo (solo desarrollo)

- **Objetivo:** En **NODE_ENV=development** se registran por consola todos los flujos (navegación, peticiones API, respuestas/errores) para que una IA pueda usar ese contexto (por ejemplo para escribir tests o reproducir el flujo).
- **Comportamiento:**
  - Cada evento se imprime en consola con prefijo `[flow:navigation]`, `[flow:api_request]`, etc.
  - Se mantiene un buffer en memoria (últimas ~500 entradas).
- **Uso desde la consola del navegador (solo en dev):**
  - `__flowLog.get()` — Array con todas las entradas del flujo.
  - `__flowLog.copy()` — Copia al portapapeles el flujo formateado (markdown + JSON) para pegarlo como contexto a una IA.
  - `__flowLog.clear()` — Vacía el buffer.
  - `__flowLog.asContext()` — Devuelve el flujo como string (para inspección o pegar manualmente).
- **Flujo de trabajo sugerido:**
  1. Un humano recorre el flujo en la app (login, pantallas, acciones).
  2. Si está correcto: en consola ejecuta `__flowLog.copy()` y pega ese contexto donde la IA pueda leerlo (por ejemplo para generar tests o documentar).
  3. Si algo falla: anota qué falló, ejecuta `__flowLog.copy()` y da a la IA el contexto + la descripción del fallo para que proponga correcciones o tests.

En producción el servicio de log de flujo **no se ejecuta** (no se registra nada y `__flowLog` no existe).

## Exportar logs a la base de datos (solo dev)

En desarrollo se muestra un **botón flotante** abajo a la derecha: **«Exportar logs a BD»**. Al pulsarlo:

1. Se envía el buffer actual del flow log a `POST /api/v1/dev-logs` con body `{ entries: [...] }`.
2. La API (solo si `NODE_ENV=development`) guarda una fila en la tabla **`frontend_logs`** con el JSON de las entradas y, si hay sesión, el `userId`.
3. Puedes consultar después los exports en la BD (por ejemplo para dar contexto a una IA o para reproducir flujos).

**Configuración de BD:** La tabla `frontend_logs` se crea automáticamente al arrancar la API en desarrollo (`synchronize: true`). Columnas: `id` (uuid), `payload` (jsonb), `userId` (uuid, opcional), `createdAt` (timestamp).

**Endpoint:** `POST /api/v1/dev-logs` — solo responde en desarrollo; en producción devuelve 403.

## Dónde se registran flujos (por feature)

En desarrollo, además de la navegación y todas las peticiones API (automáticas), se registran explícitamente:

| Feature | Acciones / formularios logueados |
|---------|----------------------------------|
| **Auth** | Login (form), Forgot password (form), Logout |
| **Objetivos** | Activar/desactivar objetivo, Guardar configuración, Añadir/eliminar departamento, Selección mes histórico |
| **Usuarios** | Añadir usuario (form), Añadir cliente (form), Configuración perfil (guardar contraseña, guardar teléfono) |
| **Fichajes** | Entrada, salida, pausa, reanudar, añadir tarea, completar tarea, eliminar tarea |
| **Productos** | Nuevo producto (form), Editar producto (form) |
| **Inventario** | Actualizar item |
| **Empresa** | Añadir/editar centro de trabajo, Añadir departamento (form) |
| **Alertas** | Aplicar filtros |
| **Operaciones** | Nueva tarea (Telemarketing), Editar tarea |
