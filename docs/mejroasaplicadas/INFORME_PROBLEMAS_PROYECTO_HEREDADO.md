# Informe de problemas: Proyecto heredado

Este documento recoge los problemas detectados en la revisión del **frontend** y del **backend** del proyecto heredado (dos repos separados: interfaz y API), antes de su migración al monorepo actual.

---

## Hallazgos tras análisis en profundidad (resumen sin referencias a rutas)

Tras leer el código del proyecto inicial (front y API) se confirmaron, entre otros, los siguientes puntos:

- **Contrato de login:** La interfaz enviaba el campo *username* en la mutación GraphQL de login; el esquema del servidor y el resolver esperan *email*. Incompatibilidad directa entre front y back.
- **Puertos por defecto:** La interfaz apuntaba por defecto al puerto 3001; el gateway GraphQL corría en 8001 y el microservicio de auth en 5001. Sin configurar variables de entorno, las peticiones no alcanzaban el backend.
- **CORS:** Tanto el gateway como el microservicio de auth tenían `origin: "*"`, riesgo de seguridad en APIs con autenticación.
- **JWT:** El secreto por defecto era cadena vacía si no se configuraban variables de entorno.
- **Inicialización duplicada:** En el servidor del microservicio auth, middlewares y rutas se registraban dos veces (en el constructor y al arrancar el servidor).
- **Datos mock:** Múltiples listas de datos estáticos (usuarios, tareas, objetivos, departamentos, etc.) usadas en varias pantallas; la interfaz dependía de ellos para desarrollo.

El resto de este informe detalla los mismos y otros problemas con referencias técnicas (rutas y archivos) para el equipo de desarrollo.

---

## Resumen ejecutivo

- **Frontend:** Contrato con API inexistente o distinto, formulario de login no conectado a la API, uso de `localStorage` en código que puede ejecutarse en servidor, rutas declaradas sin páginas, tipos `any`, y datos mock que sugieren desarrollo sin backend real.
- **Backend:** GraphQL no consumido por el front, CORS abierto (`origin: "*"`), inicialización duplicada en el microservicio auth, secretos JWT por defecto vacíos, y falta de endpoints que el front sí espera (p. ej. `/api/usuarios`).

---

## 1. Problemas del frontend (proyecto inicial)

### 1.1 Contrato con la API: puerto, rutas y método

- **BASEURL fija:** `src/constants/endpoints.ts` define `BASEURL = 'http://localhost:3001'`.
- **Backend real:** El microservicio de auth escucha en el puerto **5001** (por defecto), no en 3001. El gateway GraphQL está en 8001.
- **Rutas distintas:** El front llama a:
  - `POST /api/login`
  - `GET /api/usuarios`
  - `POST /api/usuarios`
- La API de auth expone: `POST /api/v1/auth/login`, etc. No existe en el backend heredado ningún endpoint `/api/usuarios`.
- **Conclusión:** El front no puede funcionar contra el backend tal como está; el contrato (puerto, prefijo y recursos) no coincide.

### 1.2 Formulario de login no conectado a la API

- En `src/components/templates/auth/MainContainer/index.tsx`, el `onSubmit` de Formik hace solo `console.log(values)`.
- Existe `useLoginMutation` en `src/store/api/users.ts`, pero **no se usa** en el formulario. El login real nunca se dispara.
- Además, el formulario envía `username` y `password`, mientras que el backend de auth espera **`email`** y `password`. Aunque se conectara la mutación, habría que cambiar el campo a `email` o mapear en el front.

### 1.3 Uso de `localStorage` en prepareHeaders (RTK Query)

- En `src/store/api/users.ts`, `prepareHeaders` lee el token con `localStorage.getItem("tokenIde")`.
- En Next.js (App Router), los componentes pueden renderizarse en el servidor. `localStorage` no existe en Node y provocaría error en SSR si esa ruta se ejecutara durante el render del servidor.
- Aunque RTK Query suele ejecutarse en el cliente, el código no está protegido (no hay comprobación `typeof window !== 'undefined'`), lo que es frágil y puede fallar en pre-render o en futuros usos en servidor.

### 1.4 Rutas declaradas sin páginas

- `src/constants/paths.ts` define rutas como `HOME: "/home"`, `BACKOFFICE: "/backOffice"`, `ADD_USER: "/addUser"`, `ADD_CLIENT: "/addClient"`, `FORGOT_PASSWORD: "/forgot-password"`, etc.
- En `src/app` solo existe la estructura `[locale]/` con `page.tsx` (login), `layout.tsx`, `providers.tsx` y estilos. **No hay páginas** para `/home`, `/backOffice`, `/addUser`, `/addClient`, `/forgot-password`, etc.
- Las rutas están declaradas pero no implementadas; enlaces a esas rutas llevarían a 404 o a comportamiento indefinido.

### 1.5 Tipado débil (`any`)

- En `src/store/api/users.ts`: `login: builder.mutation<any, any>`, `getUsers: builder.query<any, any>`, y `transformResponse` usa `(response: any)`, `(item: any)`.
- En `src/store/store.ts`: `getDefaultMiddleware: any`.
- En `src/i18n/request.ts`: `locale as any` al comprobar el locale.
- Falta de tipos compartidos con la API y de DTOs claros; dificulta refactors y detectar errores en tiempo de compilación.

### 1.6 Slice Redux `userData` mal modelado

- `src/store/slices/userData.ts` define `userInfo` como **número** y la acción `userDataAction` recibe un número.
- Por el nombre y el contexto (login, usuarios), lo esperable sería guardar un objeto de usuario (id, email, nombre, etc.), no un número. El modelo de estado no refleja el dominio.

### 1.7 Datos mock y dependencia implícita

- `src/constants/dataMock.ts` exporta un array largo de usuarios de prueba (nombre, email, etc.).
- Sugiere que se desarrollaron pantallas (por ejemplo listados) usando datos estáticos en lugar de `getUsers` contra la API. Combinado con la ausencia de `/api/usuarios` en el backend, refuerza que front y back no estaban alineados.

### 1.8 Middleware de next-intl en archivo `proxy.ts`

- El contenido de `src/proxy.ts` es el típico de **middleware de next-intl** (createMiddleware, routing, matcher).
- En Next.js, el middleware debe vivir en `middleware.ts` (en la raíz o en `src/`). Un archivo llamado `proxy.ts` no es reconocido como middleware, por lo que **el middleware de next-intl podría no estar aplicándose** si no existe `middleware.ts` que lo use o reexporte.

### 1.9 Input sin atributos de accesibilidad

- En `src/components/atoms/Input/index.tsx` el `<input>` no tiene `aria-invalid`, `aria-describedby` ni asociación explícita con el mensaje de error. Para formularios accesibles convendría mejorar estos aspectos.

### 1.10 Un solo locale configurado

- `src/i18n/routing.ts` define solo `locales: ["es"]` y `defaultLocale: "es"`. El matcher en `proxy.ts` incluye `(es|en)`, pero "en" no está en la lista de locales, lo que puede generar inconsistencias si se usa la ruta en inglés.

---

## 2. Problemas del backend (proyecto inicial)

### 2.1 GraphQL no consumido por el front

- El gateway expone GraphQL (Apollo) en rutas como `/auth`; el microservicio auth expone REST en `/api/v1/auth/...`.
- El front no usa GraphQL: llama por REST a `localhost:3001` y a endpoints que no existen en este backend. Se mantiene la complejidad de Apollo, subgraphs y dataSources sin beneficio para el cliente real.

### 2.2 CORS abierto a cualquier origen

- En `src/server.ts` (gateway): `cors({ origin: "*", ... })`.
- En `microservices/auth/src/server.ts`: `cors({ origin: "*", ... })`.
- Permitir `origin: "*"` en APIs que manejan autenticación (login, tokens) es un riesgo de seguridad; debería restringirse a orígenes conocidos (dominios del front).

### 2.3 Inicialización duplicada en el microservicio auth

- En `microservices/auth/src/server.ts`, el constructor llama a `this.init()`, que a su vez llama a `initMiddlewares()` e `initRoutes()`.
- `listen()` vuelve a llamar a `this.initMiddlewares()` y `this._routes.init()` antes de levantar el servidor.
- Las rutas y middlewares se registran dos veces; puede dar comportamiento confuso o efectos secundarios duplicados (p. ej. middleware que cuenta peticiones).

### 2.4 CORS registrado dos veces en auth

- En `initMiddlewares()` del auth: primero `this._app.use(cors())` y después `this._app.use(cors({ origin: "*", ... }))`. Dos middlewares CORS consecutivos son redundantes y el primero sin opciones puede no ser el deseado en producción.

### 2.5 Secretos JWT por defecto vacíos

- En `microservices/common/src/constants/env.ts`: `JWT_SIGN_SEED` y `JWT_SECRET` se definen como `process.env.JWT_SIGN_SEED || process.env.JWT_SECRET || ""`.
- Si no se configuran variables de entorno, el valor por defecto es cadena vacía. Firmar JWTs con secreto vacío es inseguro y puede permitir tokens falsificados o predecibles.

### 2.6 Endpoints que el front espera y no existen

- El front llama a `GET /api/usuarios` y `POST /api/usuarios` (y espera BASEURL en puerto 3001).
- En el backend heredado solo existe el microservicio de **auth** (login, forgot-password, refresh token, etc.). No hay ningún servicio ni ruta para "usuarios" (listado, alta, etc.).
- Imposibilidad de que las pantallas de usuarios del front funcionen contra esta API tal como está.

### 2.7 Desalineación de puertos y prefijos

- Front: `http://localhost:3001` + `/api/login`, `/api/usuarios`.
- Auth real: `http://localhost:5001` + `/api/v1/auth/login`, etc.
- Gateway: puerto 8001, rutas GraphQL por subgraph (p. ej. `/auth`). No hay proxy ni BFF que unifique en 3001 ni que exponga `/api/login` o `/api/usuarios`.

### 2.8 Manejo de errores con `any`

- En `src/utils/errorHandler.ts`: parámetro `error: any` y acceso a `error.extensions`, `error.message` sin tipado.
- En `src/dataSources/authAPI.ts`: `catch (error: any)` en todos los métodos.
- En resolvers de auth: `_root: any`. Dificulta mantenimiento y puede ocultar errores.

### 2.9 Respuesta del login del backend vs expectativas del front

- El backend de auth devuelve un formato tipo `ResponseModel` (success, message, data, error, version) con `data_return = { userData: secureUserData, token }`.
- El front, en `prepareHeaders`, espera un token en `localStorage` con clave `"tokenIde"` y en el login probablemente esperaría guardar ese token y quizá algo de userData. No hay en el código del front manejo explícito de la respuesta del login (ni uso de la mutación), por lo que no se puede asegurar que el formato esté alineado sin ver la integración completa; lo que sí está claro es que la integración no existe (formulario no llama a la API).

### 2.10 Código comentado / rutas 404 del gateway

- En el gateway, rutas como `"/"`, `"/robots.txt"`, `"/sitemap.xml"` devuelven 404 con JSON. Tiene sentido para no exponer contenido, pero devolver 404 para "/" puede chocar con expectativas de health checks o de un front que use la misma base URL; convendría al menos un health check explícito (p. ej. `/health`) que devuelva 200.

### 2.11 Base de datos: dialecto por variable de entorno

- En `microservices/common/src/database/database.ts` el dialecto se toma de `process.env.DB_DIALECT` con fallback a `"mssql"`. El package.json del template menciona PostgreSQL/Sequelize. Si el equipo asume PostgreSQL y no se setea `DB_DIALECT`, la conexión intentaría MSSQL y podría fallar de forma poco clara.

---

## 3. Problemas transversales (front + back)

### 3.1 Sin tipos compartidos

- No hay un paquete o repo común de tipos/DTOs entre front y back. El front mapea a mano en `transformResponse` (p. ej. `nombre` → `name`, `apellidos` → `last_name`). Cualquier cambio en la API obliga a tocar el front sin una única fuente de verdad.

### 3.2 Documentación de API

- No se ha visto OpenAPI/Swagger en el backend heredado. Los contratos (REST o GraphQL) no están documentados de forma estándar para el front, lo que dificulta la integración y el onboarding.

### 3.3 Dos repos y dos despliegues

- Front y API en repos y pipelines separados. Versiones desalineadas (p. ej. front en 3001 y rutas viejas, back en 5001 con `/api/v1/auth`) sin un único lugar donde se definan contrato y versión.

---

## 4. Tabla resumen de problemas

| Área | Problema | Severidad |
|------|----------|-----------|
| Front | BASEURL 3001 y rutas /api/* no coinciden con backend (5001, /api/v1/auth/*) | Alta |
| Front | Login: onSubmit solo console.log; no se usa useLoginMutation | Alta |
| Front | Campo username en login; API espera email | Media |
| Front | localStorage en prepareHeaders sin guarda para SSR | Media |
| Front | Rutas en paths.ts sin páginas implementadas | Alta |
| Front | Uso de `any` en store e i18n | Media |
| Front | userData slice con userInfo numérico en lugar de objeto usuario | Media |
| Front | proxy.ts como middleware (debería ser middleware.ts) | Media |
| Front | dataMock y desarrollo sin API real de usuarios | Baja |
| Back | CORS origin: "*" en gateway y auth | Alta |
| Back | init duplicado en auth (constructor + listen) | Media |
| Back | CORS aplicado dos veces en auth | Baja |
| Back | JWT secret por defecto "" | Alta |
| Back | No existe /api/usuarios; front lo espera | Alta |
| Back | GraphQL no usado por el front | Arquitectura |
| Back | error: any y _root: any | Baja |
| Transversal | Sin tipos compartidos entre front y API | Alta |
| Transversal | Sin documentación OpenAPI/Swagger | Media |

---

## 5. Conclusión

El proyecto heredado presenta **problemas graves de integración** (contrato distinto entre front y back, login no conectado, endpoints inexistentes), **riesgos de seguridad** (CORS abierto, JWT sin secreto por defecto) y **deuda técnica** (tipos `any`, rutas declaradas sin implementar, inicialización duplicada, middleware mal ubicado). La migración al monorepo actual, con REST coherente, tipos compartidos (`shared-types`), un solo repo y arquitectura definida, aborda la mayoría de estos puntos y es una base más sólida para seguir desarrollando.

---

*Informe basado en la revisión del código de front-biosstel-main y api-biosstel-main (proyecto heredado).*
