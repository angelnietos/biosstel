# Swagger / OpenAPI – Documentación y pruebas de la API

## URL

Con la API en marcha (`pnpm dev:api` o `pnpm run dev` desde la raíz):

- **Swagger UI (ver y probar endpoints):** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **OpenAPI JSON (especificación):** [http://localhost:4000/api/docs-json](http://localhost:4000/api/docs-json)

## Cómo usar

1. Arranca la API: `pnpm dev:api`.
2. Abre en el navegador: **http://localhost:4000/api/docs**.
3. Los endpoints están agrupados por **tags** (health, auth, users, fichajes, objetivos, alertas, operaciones, empresa).
4. Para probar una petición:
   - Abre el endpoint.
   - Pulsa **"Try it out"**.
   - Rellena parámetros/body si aplica y pulsa **"Execute"**.
5. Para rutas protegidas con JWT:
   - Pulsa **"Authorize"** (candado) arriba.
   - Introduce el token (por ejemplo el que devuelve `POST /api/auth/login`) como `Bearer <token>`.
   - La opción **persistAuthorization** mantiene el token mientras uses la pestaña.

## Endpoints actuales (resumen)

| Tag         | Rutas principales                                                   |
| ----------- | ------------------------------------------------------------------- |
| health      | `GET /api/health`, `/api/health/live`, `/api/health/ready`          |
| auth        | `POST /api/auth/login`, `POST /api/auth/forgot-password`            |
| users       | `GET/POST /api/users`, `GET/PUT/DELETE /api/users/:id`              |
| fichajes    | `GET /api/fichajes`                                                 |
| objetivos   | `GET /api/dashboard/home`, `GET /api/dashboard/terminal-objectives` |
| alertas     | `GET /api/alertas`                                                  |
| operaciones | `GET /api/operaciones`                                              |
| empresa     | `GET /api/empresa`                                                  |
