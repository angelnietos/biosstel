# API — Formato de respuestas y errores

## Respuestas de éxito

Los endpoints devuelven normalmente el cuerpo que corresponda (array, objeto, etc.). Se puede incluir un wrapper consistente cuando tenga sentido, por ejemplo:

```json
{ "data": { ... }, "message": "Recurso creado" }
```

No hay un formato único obligatorio para éxito; cada controlador puede devolver el DTO o entidad directamente.

## Errores (formato estándar)

Todos los errores HTTP pasan por el **GlobalHttpExceptionFilter** y se devuelven con este formato:

```json
{
  "statusCode": 400,
  "message": "Validation failed" | ["campo1 must be...", "campo2 should not be empty"],
  "error": "BadRequestException",
  "path": "/api/v1/users"
}
```

- **statusCode:** Código HTTP (400, 401, 403, 404, 500, etc.).
- **message:** Mensaje legible o array de mensajes (p. ej. errores de validación de class-validator).
- **error:** Nombre de la excepción (BadRequestException, UnauthorizedException, etc.).
- **path:** Ruta de la petición (útil para logs y depuración).

Los errores 5xx se registran en el logger con stack trace.

## Validación de entrada

Se usa **ValidationPipe** global con:

- `whitelist: true` — se eliminan propiedades no definidas en el DTO.
- `transform: true` — conversión de tipos (query/params a number, etc.).
- Los DTOs deben usar **class-validator** (`IsString`, `IsEmail`, `IsOptional`, etc.) para que los errores de validación devuelvan el formato anterior con `message` en array cuando corresponda.

## Health

- **GET /api/health** — Live check (sin BD).
- **GET /api/health/full** — Incluye chequeo de BD, memoria y disco.

Ambos devueltos por el `HealthController` de NestJS; útiles para CI/E2E y orquestación.
