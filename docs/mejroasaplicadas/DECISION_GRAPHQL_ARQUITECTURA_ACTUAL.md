# Decisión: GraphQL en la arquitectura actual (monorepo)

Se ha valorado si **alguna feature** del monorepo actual debería exponer **GraphQL** (p. ej. con `@nestjs/graphql` + Apollo, o una lib dedicada). Conclusión: **no se añade GraphQL** por ahora; REST sigue siendo suficiente.

---

## Revisión por feature

| Feature / Área | Uso actual | ¿GraphQL útil? |
|----------------|------------|-----------------|
| **Auth** | Login, refresh, JWT. Endpoints claros. | No. REST es el estándar para auth. |
| **Usuarios** | CRUD y listado. | No. Recursos bien definidos. |
| **Objetivos** | Queries (terminal objectives, dashboard home). | No. Dashboard ya devuelve un DTO único (objetivos + alertas del mismo módulo). |
| **Dashboard** | `GET /dashboard/home` → `DashboardHomeResponse` (objectives + alerts). | No. Una respuesta, un contrato. Sin necesidad de que el cliente moldee la query. |
| **Fichajes** | Clock in/out, tareas, listados. | No. Comandos y consultas encajan en REST. |
| **Operaciones** | Lógica de negocio asociada a eventos (fichaje ended). | No. |
| **Empresa** | Cuentas contables, etc. | No. |
| **Alertas** | `GET /alertas` → listado. | No hoy. Ver abajo. |

---

## Casos en los que sí tendría sentido valorar GraphQL más adelante

- **Alertas en tiempo real:** Si en el futuro se requiere que el cliente reciba **notificaciones al instante** (p. ej. nueva alerta sin hacer polling), las **subscriptions** de GraphQL son una opción. Alternativas igual de válidas: WebSockets con un protocolo propio, o Server-Sent Events (SSE) desde un endpoint REST. No es necesario GraphQL solo por eso.
- **Dashboard muy variable:** Si distintas pantallas o clientes (web, móvil) necesitaran **formas muy distintas** de los mismos datos (muchos campos opcionales, anidación variable) y se quisiera un único endpoint que el cliente moldee, entonces GraphQL podría ayudar. Hoy el dashboard tiene un contrato fijo y está bien con REST.
- **Varios clientes con necesidades muy distintas:** Si hubiera varios frontends (admin, app móvil, integraciones) que pidan combinaciones muy diferentes de datos en una sola petición, GraphQL podría reducir el número de endpoints. No es el caso actual.

---

## Conclusión

- **No se introduce GraphQL** en la arquitectura actual: ninguna feature lo necesita de forma clara.
- Si en el futuro aparece un requisito concreto (p. ej. suscripciones en vivo para alertas, o queries muy flexibles para un nuevo dashboard), se puede:
  - Añadir el módulo **GraphQL solo para ese ámbito** (p. ej. `@nestjs/graphql` en api-biosstel con un módulo `AlertasGraphqlModule` o `DashboardGraphqlModule`), o
  - Resolverlo con **WebSockets/SSE** o endpoints REST específicos, según convenga.

No se añaden dependencias ni código GraphQL hasta que haya una necesidad explícita.
