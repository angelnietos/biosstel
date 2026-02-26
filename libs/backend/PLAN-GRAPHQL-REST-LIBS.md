# Plan: GraphQL y REST Postgres en todas las libs

Este documento describe el estado actual (api-usuarios como referencia) y el plan para tener **GraphQL** (config por lib) y **REST Postgres** en el resto de librerías del backend.

---

## 1. Scripts para probar API (api-usuarios)

### Docker (ambas a la vez o una por comando)

| Script | Puerto(s) | Modo |
|--------|-----------|------|
| `pnpm api:docker:both` | **3020** + **3021** | Levanta **las dos** APIs: GraphQL (3020) y REST (3021) con un solo Postgres. |
| `pnpm api:docker:graphql` | 3020 | Solo API GraphQL (mismo compose antiguo, un servicio). |
| `pnpm api:docker:rest` | 3021 | Solo API REST (mismo compose antiguo, un servicio). |

### Local sin Docker (más rápido; requiere Postgres: `pnpm db:start`)

| Script | Puerto | Modo |
|--------|--------|------|
| `pnpm api:local:graphql` | **3020** | API con GraphQL (`GRAPHQL_FEATURES=users`). Con nodemon (watch). |
| `pnpm api:local:rest` | **3021** | API solo REST. Con nodemon (watch). |

Puedes tener **las dos locales a la vez** en dos terminales (una por script).

### Pruebas con curl

**REST (puerto 3021):**
```bash
curl -s "http://localhost:3021/api/v1/health/live"
curl -s "http://localhost:3021/api/v1/users?page=1&pageSize=5"
```

**GraphQL (puerto 3020):**
```bash
curl -s "http://localhost:3020/api/v1/health/live"
curl -s -X POST http://localhost:3020/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users(page: 1, pageSize: 5) { items { id email } total } }"}'
```

**Scripts de prueba:**
- `pnpm api:test:curl` — muestra los comandos anteriores
- `pnpm api:test:curl:rest` — ejecuta pruebas contra 3021
- `pnpm api:test:curl:graphql` — ejecuta pruebas contra 3020

---

## 2. Estado actual: api-usuarios (referencia)

api-usuarios ya tiene **ambas** superficies:

| Capa | REST | GraphQL |
|------|------|---------|
| **Controller/Resolver** | `UsersController` (POST/GET/PUT/DELETE `/api/v1/users`) | `UsersResolver` (queries `users`, `user`) |
| **Tipos** | DTOs en `application/dto` | `UserType`, `UsersPaginatedType` en `infrastructure/graphql` |
| **Mapper** | Persistencia: `UserMapper` (domain ↔ ORM) | Presentación: `UserGraphQLMapper` (domain → GraphQL) |
| **Registro en app** | `UsersModule` con controllers | `AppGraphQLModule` (apps/api-biosstel) cuando `graphql.features` incluye `users` |

Configuración:

- **settings.json** (opcional): `{ "graphql": { "enabled": true, "features": ["users"] } }`
- **Env**: `GRAPHQL_ENABLED=true`, `GRAPHQL_FEATURES=users`

---

## 3. Checklist por lib (para replicar el patrón)

Para cada librería que deba exponer GraphQL y REST Postgres:

### 3.1 REST / Postgres (ya está en la mayoría)

- [ ] **Controller** en `infrastructure/postgres/api/controllers/<feature>/` con `@Controller`, `@Get`, `@Post`, etc.
- [ ] Uso de **IMediator** (CQRS): `mediator.execute(Query)` y `mediator.send(Command)`.
- [ ] **DTOs** en `application/dto` para entrada (validación + Swagger).
- [ ] **Handlers** con `@CommandHandler` / `@QueryHandler` (NestJS CQRS).
- [ ] **Repositorio** Postgres implementando el puerto del dominio.
- [ ] **Mapper** domain ↔ entidad ORM en `infrastructure/postgres/mappers/`.

### 3.2 GraphQL (por lib)

- [ ] **Tipos GraphQL** en `infrastructure/graphql/<feature>.graphql-types.ts` (code-first: `@ObjectType()`, `@Field()`).
- [ ] **Resolver** en `infrastructure/graphql/<feature>.resolver.ts`: `@Query()`, `@Mutation()` si aplica; inyectar el repositorio o el mismo use case que REST.
- [ ] **Mapper** dominio → tipos GraphQL en `infrastructure/graphql/mappers/` (ej. `toGraphQL()`, `toPaginatedGraphQL()`).
- [ ] **Export** del resolver y mapper en `infrastructure/graphql/index.ts` y en el `public-api` de la lib.
- [ ] **Registro en app**: en `apps/api-biosstel/src/graphql/graphql.module.ts`:
  - Añadir el feature a `graphql.features` (o env `GRAPHQL_FEATURES`).
  - Importar y registrar el resolver y mapper en `providers` cuando `isGraphQLEnabledForFeature('<feature>')`.

### 3.3 Config global

- **api-shared** (`getFeatureAdapter`, `getGraphQLConfig`, `isGraphQLEnabledForFeature`): ya soporta `graphql.enabled` y `graphql.features` por feature.
- Añadir el nuevo feature a `FeatureKey` en `api-shared` si aún no está.

---

## 4. Orden sugerido por lib

| Lib | REST/Postgres | GraphQL | Notas |
|-----|----------------|---------|--------|
| **api-usuarios** | ✅ Hecho | ✅ Hecho | Referencia; ya probado con scripts 3020/3021. |
| **api-auth** | ✅ (login, refresh, getMe) | Pendiente | Solo si se quiere exponer auth por GraphQL (p. ej. mutations login/refresh). |
| **api-empresa** | ✅ (departamentos, work centers) | Pendiente | Resolver para departamentos, tipos, mapper. |
| **api-fichajes** | ✅ (fichajes, tasks) | Pendiente | Resolvers para fichajes y tasks; tipos y mappers. |
| **api-objetivos** | ✅ (dashboard) | Pendiente | Resolver para dashboard home y objetivos. |
| **api-alertas** | ✅ (alertas CRUD) | Pendiente | Resolver para list/create/update/delete alertas. |
| **api-productos** | ✅ (productos, inventario, reports) | Pendiente | Resolvers por subdominio (productos, inventario, reports). |
| **api-operaciones** | ✅ (list operaciones) | Pendiente | Resolver de listado si se expone por GraphQL. |

---

## 5. Pasos concretos para añadir GraphQL a una lib (ej. api-empresa)

1. **Tipos**  
   Crear `libs/backend/api-empresa/src/infrastructure/graphql/department.graphql-types.ts` con `DepartmentType`, `DepartmentsPaginatedType` (o equivalente).

2. **Mapper**  
   Crear `DepartmentGraphQLMapper` que convierta entidad de dominio (o plain) a `DepartmentType` y a paginado.

3. **Resolver**  
   Crear `DepartmentsResolver` con `@Query() departments(...)`, `@Query() department(@Args('id'))`; inyectar repositorio o use case y usar el mapper.

4. **Export**  
   Exportar resolver y mapper desde `api-empresa` (p. ej. `infrastructure/graphql/index.ts` y `src/index.ts` si aplica).

5. **App GraphQL**  
   En `apps/api-biosstel/src/graphql/graphql.module.ts`:
   - Añadir `'empresa'` (o el feature key que uses) a la lista de features que se leen de config.
   - En `providers`, registrar `DepartmentsResolver` y `DepartmentGraphQLMapper` cuando `isGraphQLEnabledForFeature('empresa')`.

6. **Config**  
   Para probar: `GRAPHQL_FEATURES=users,empresa` o en `settings.json`: `graphql.features: ["users", "empresa"]`.

7. **Pruebas**  
   Usar `pnpm api:docker:graphql` y curl/Postman a `http://localhost:3020/graphql` con una query de `departments`.

---

## 6. Resumen

- **Scripts**: `api:docker:graphql` (3020) y `api:docker:rest` (3021) permiten validar api-usuarios en ambos modos.
- **Pruebas**: `api:test:curl`, `api:test:curl:graphql`, `api:test:curl:rest` para comprobar health y usuarios.
- **Plan**: Para cada lib, aplicar el checklist REST/Postgres + GraphQL (tipos, resolver, mapper, registro en `AppGraphQLModule` y config por feature).
