# API Template - Arquitectura de Microservicios

Plantilla base con **Gateway GraphQL** (Apollo) y **microservicios Express** en localhost, librería compartida `common` y patrón **facade** en services.

## Arquitectura

- **Gateway** (`src/`): Apollo Server con subgraphs; único punto de entrada público.
- **Microservicios**: Express en localhost; accesibles solo vía Gateway (REST DataSource).
- **Common** (`microservices/common/`): BD (Sequelize), constantes, utilidades, modelos compartidos.
- **Auth**: microservicio de ejemplo con login, refresh token, forgot/reset password, auth code.

### Estructura del proyecto

```
api-template/
├── app.ts                    # Entrada Gateway
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── env.example
├── src/                      # Gateway GraphQL
│   ├── constants/            # Endpoints, URLs de servicios (env)
│   ├── context/              # getTokenFromRequest
│   ├── dataSources/         # Solo AuthAPI (REST hacia microservicio auth)
│   ├── subgraphs/            # Solo auth (typedef, resolvers, subgraph)
│   ├── utils/                # errorHandler, event-emitter-config
│   └── server.ts
└── microservices/
    ├── common/               # Librería compartida
    │   ├── src/
    │   │   ├── constants/    # ENV, ERROR_CODES, STRINGS, DEVELOPMENT_KEYS, etc.
    │   │   ├── database/    # Database, defaultConnectionParams
    │   │   ├── language/    # Language.getValue
    │   │   ├── middlewares/ # DefaultRequestMiddlewares
    │   │   ├── models/      # SHARED_MODELS (implementar con tus modelos)
    │   │   └── utils/       # ResponseModel, TokenHandler, cryptoHandler, mailer, etc.
    │   └── index.ts
    └── auth/                 # Microservicio de ejemplo
        ├── app.ts
        ├── package.json
        ├── tsconfig.json
        ├── env.example
        └── src/
            ├── constants/
            ├── controllers/  # post/login, forgotPassword, resetPassword, etc.
            ├── middlewares/
            ├── routes/
            ├── server.ts
            └── services/
                └── auth/     # Patrón facade
                    ├── auth.service.ts              # Facade
                    ├── getUserWithOrganizationAndRoles.service.ts
                    ├── getUserEmailById.service.ts
                    ├── setResetPassword.service.ts
                    ├── updatePassword.service.ts
                    ├── updateAuthCodeStatus.service.ts
                    ├── updateAuthCodeEmailSentDate.service.ts
                    ├── activateAuthCode.service.ts
                    └── activateAuthCodeByEncryptedId.service.ts
```

## Requisitos

- Node.js v18+
- pnpm
- Base de datos (MSSQL o PostgreSQL según `DB_DIALECT`)

## Variables de entorno

**Raíz** (Gateway): copiar `env.example` a `.env`

- `GATEWAY_PORT` (default 8001)
- `GATEWAY_HOST`, `NODE_ENV`
- `MS_AUTH_PORT` (default 5001) – usado por AuthAPI para llamar al microservicio auth

**Microservicio auth**: `microservices/auth/env.example` → `microservices/auth/.env`

- `PORT` / `MS_AUTH_PORT` (5001)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` / `JWT_SIGN_SEED`
- `FRONTEND_URL`, `FRONTEND_VERIFY_CODE_URL`
- `MAILER_*` (envío de emails)

**Common**: `microservices/common/env.example` → `microservices/common/.env`

- Mismas variables de BD y JWT si common las lee desde su `.env`.

## Instalación

```bash
cd api-template
pnpm install
cp env.example .env
cp microservices/auth/env.example microservices/auth/.env
cp microservices/common/env.example microservices/common/.env
# Editar .env con valores reales
```

## Base de datos

1. Crear la base de datos.
2. Implementar **SHARED_MODELS** en `microservices/common/src/models/index.ts` con tus modelos Sequelize (User, Organization, Role, UserRole, OrganizationRole, UserOrganization, etc.) y asociaciones.
3. Crear tablas necesarias (p. ej. `tblUsers`, `tblAuthCodes` o los nombres que uses; configurables con `TABLE_USERS`, `TABLE_AUTH_CODES`, `DB_SCHEMA`).

## Ejecución

```bash
# Gateway + microservicio auth
pnpm run dev
```

- Gateway: `http://localhost:8001`
- Subgraph auth: `http://localhost:8001/auth`
- Auth REST (solo localhost): `http://localhost:5001/api/v1/auth/...`

## Arquitectura de services (patrón Facade)

Cada dominio (p. ej. auth) tiene:

- **Un facade**: `auth.service.ts` – instancia los servicios individuales y expone un método por operación.
- **Servicios por operación**: un archivo por caso de uso (`login`, `getUserById`, `updatePassword`, etc.) con una clase que implementa `execute(...)`.

**Ventajas**

- Una sola importación en controllers: `import { AuthService } from '../services/auth/auth.service'`.
- API clara y fácil de extender: nueva operación = nuevo servicio + método en el facade.
- Archivos acotados (< 200 líneas por servicio).
- Testeable: mock del facade o de cada servicio.

**Añadir una nueva operación**

1. Crear `nuevaOperacion.service.ts` con `export class NuevaOperacionService { async execute(...) { ... } }`.
2. En el facade: importar, instanciar en el constructor y exponer `async nuevaOperacion(...) { return this.nuevaOperacionService.execute(...); }`.
3. Usar en el controller: `authService.nuevaOperacion(...)`.

## Añadir otro microservicio

1. Copiar la estructura de `microservices/auth` (app, server, routes, controllers, services con facade).
2. Añadir el paquete en `pnpm-workspace.yaml` (ya está `microservices/*`).
3. En el Gateway: nuevo dataSource (clase REST que apunte al puerto del microservicio), nuevo subgraph (typedef + resolvers), registrar en `subgraphs/index.ts` y en el mapa de dataSources por subgraph en `server.ts`.
4. Scripts en `package.json` raíz: `dev:nombre`, `build:nombre` si quieres.

## Scripts

- `pnpm run dev` – Gateway + auth en desarrollo
- `pnpm run build` – Compila raíz, common y microservicios
- `pnpm run dev:graphql` – Solo Gateway
- `pnpm run dev:auth` – Solo microservicio auth

## Convenciones

- Nomenclatura de archivos: `kebab-case` o `camelCase` según zona (p. ej. servicios: `nombreOperacion.service.ts`).
- Rutas API: `/api/v1/{dominio}/{recurso}` (ej. `/api/v1/auth/login`).
- Respuestas: `ResponseModel` (success, message, data, error, version).
- Tokens: header `Authorization: Bearer <token>`.

## Seguridad

- Microservicios escuchan solo en `localhost`.
- Helmet y CORS configurados en Gateway y en auth.
- Secrets (JWT, BD, mailer) solo en variables de entorno.

---

**Nota**: El proyecto de origen usaba MSSQL; la plantilla permite `DB_DIALECT=mssql` o `postgres`. Con PostgreSQL, instalar `pg` y configurar `DB_DIALECT=postgres`.
