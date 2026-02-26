# Adaptadores por feature (postgres / mongo / http)

Cada feature puede usar su propia persistencia o microservicio sin cambiar la lógica de aplicación.

## Config Server

La API expone la configuración por feature vía REST (origen único para elegir BD/microservicio por feature):

- **GET /api/config** — Configuración completa: `source`, `database` (defaultAdapter, features, serviceUrls, connectionStrings), `profile`, `loadedAt`.
- **GET /api/config/features** — Lista por feature: `feature`, `adapter`, `serviceUrl`, `connectionString`.

Cualquier microservicio o herramienta de ops puede consumir estos endpoints para saber qué adaptador usa cada feature y qué URLs usar. La fuente actual es `settings.json` + variables de entorno; en el futuro se puede apuntar a un config server remoto.

## Configuración (settings.json)

En la raíz del monorepo, `settings.json` (o copia de `settings.json.example`):

```json
{
  "database": {
    "defaultAdapter": "postgres",
    "features": {
      "users": "postgres",
      "fichajes": "postgres",
      "alertas": "postgres"
    },
    "serviceUrls": {
      "users": "http://localhost:4001/api/v1"
    },
    "connectionStrings": {
      "users": "postgresql://user:pass@host:5432/users_db"
    }
  }
}
```

- **defaultAdapter**: `postgres` | `mongo` | `http` (por defecto `postgres`).
- **features**: adaptador por feature. Si no se indica, se usa `defaultAdapter`.
- **serviceUrls**: URL base del servicio cuando el feature usa `http` (microservicio).
- **connectionStrings**: connection string por feature cuando cada uno tiene su propia BD.

Variables de entorno (override por feature):

- `FEATURE_<NAME>_ADAPTER` — ej. `FEATURE_USERS_ADAPTER=mongo`
- `FEATURE_<NAME>_SERVICE_URL` — ej. `FEATURE_USERS_SERVICE_URL=http://users-svc:4000/api`
- `FEATURE_<NAME>_CONNECTION_STRING` — ej. para BD dedicada del feature

## Cómo escalar un feature

1. **Misma BD, otro motor (Mongo)**  
   Poner `features.users: "mongo"` e implementar el adaptador Mongo (hoy lanza `NotImplementedException` hasta conectar Mongoose).

2. **Microservicio propio**  
   Poner `features.users: "http"` y `serviceUrls.users` (o `FEATURE_USERS_SERVICE_URL`). El adaptador HTTP llama a ese servicio para CRUD de usuarios.

3. **Dejar en Postgres**  
   No definir `features` o poner `features.users: "postgres"` (comportamiento actual).

## Features con adaptadores

| Feature     | Port / token        | Adaptadores                    |
|------------|---------------------|--------------------------------|
| users      | `USER_REPOSITORY`   | TypeORM (postgres), Mongo, HTTP |
| fichajes   | `IFichajeRepository`| Postgres (Mongo preparado)      |

Los handlers y use cases inyectan el **port** (interfaz), no la implementación concreta.
