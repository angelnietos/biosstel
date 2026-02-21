# Libs Backend — Estructura estándar

Todas las librerías de dominio del API (`api-auth`, `api-usuarios`, `api-objetivos`, `api-fichajes`, `api-alertas`, `api-operaciones`, `api-empresa`, `api-productos`) siguen la **misma estructura de carpetas y convenciones**. La lib `api-shared` es transversal (utilidades, CQRS, eventos) y no sigue esta estructura.

---

## Estructura de carpetas obligatoria

```
libs/backend/api-{feature}/
├── src/
│   ├── application/                    # Capa de aplicación (use cases + puertos)
│   │   ├── ports/
│   │   │   ├── input/                  # Interfaces de entrada (qué puede hacer el sistema)
│   │   │   │   ├── I{Feature}Management.ts
│   │   │   │   └── index.ts
│   │   │   ├── output/                 # Interfaces de salida (repositorios / dependencias externas)
│   │   │   │   ├── I{Feature}Repository.ts   (opcional si se usan domain/repositories)
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── use-cases/
│   │   │   ├── {Feature}ManagementUseCase.ts
│   │   │   └── index.ts
│   │   ├── handlers/                   # Opcional: CQRS command/query handlers
│   │   ├── commands/                   # Opcional: CQRS commands
│   │   ├── queries/                    # Opcional: CQRS queries
│   │   └── index.ts
│   │
│   ├── infrastructure/                 # Capa de infraestructura (adaptadores)
│   │   ├── api/                        # Input adapters (controllers REST)
│   │   │   ├── {feature}.controller.ts
│   │   │   ├── dto/                    # Opcional: DTOs de la feature
│   │   │   └── index.ts
│   │   ├── persistence/                # Output adapters (TypeORM)
│   │   │   ├── *Entity.ts
│   │   │   ├── TypeOrm*Repository.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── domain/                         # Opcional: entidades puras / repositorios (legacy)
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── index.ts
│   │
│   ├── {feature}.module.ts             # Módulo NestJS
│   ├── {feature}.service.ts            # Servicio de aplicación (facade a use cases)
│   └── index.ts                        # Exports públicos
│
├── project.json
├── tsconfig.json
├── tsconfig.lib.json
└── package.json
```

---

## Reglas

| Elemento | Regla |
|----------|--------|
| **Nombre de la lib** | `api-{feature}` en kebab-case (ej. `api-usuarios`, `api-fichajes`). |
| **Módulo / servicio** | `{feature}.module.ts`, `{feature}.service.ts` (ej. `usuarios.module.ts`, `fichajes.service.ts`). El nombre `{feature}` debe coincidir con el nombre de la lib sin el prefijo `api-`. |
| **Puertos de entrada** | Siempre en `application/ports/input/`. Interfaz principal: `I{Feature}Management.ts`. |
| **Puertos de salida** | En `application/ports/output/` (recomendado) o en `domain/repositories/` si ya existe. Interfaz: `I{Feature}Repository.ts` o por agregado. |
| **Use cases** | En `application/use-cases/`. Implementan los input ports. |
| **Controllers** | En `infrastructure/api/`. Un controller por recurso o agrupados; siempre con `index.ts` que exporte los controllers. |
| **Entidades TypeORM** | En `infrastructure/persistence/`. Sufijo `*Entity.ts`. |
| **Repositorios TypeORM** | En `infrastructure/persistence/`. Prefijo `TypeOrm`, sufijo `Repository.ts`. Implementan los output ports. |
| **DTOs** | En `infrastructure/api/dto/` o junto al controller. Con class-validator para validación. |

---

## Contenido de `index.ts` (raíz de la lib)

Todas las libs deben exportar de forma homogénea:

```typescript
/**
 * @biosstel/api-{feature} - Descripción breve.
 * Arquitectura hexagonal: application (ports + use-cases) + infrastructure (api + persistence).
 */

export * from './domain';           // Si existe
export * from './application';
export * from './infrastructure';
export * from './{feature}.module';
export * from './{feature}.service';
export * from './infrastructure/api/{feature}.controller';  // Controller principal (y otros si aplica)
```

Si una lib tiene varios controllers (ej. `api-productos`: productos, inventory, reports), exportar cada uno o un barrel en `infrastructure/api/index.ts` y exportar ese barrel desde el `index.ts` raíz.

---

## Naming consistente

- **application/ports/input**: `I{Feature}Management.ts` (ej. `IUserManagement`, `IProductosManagement`).
- **application/ports/output**: `I{Feature}Repository.ts` o `I{Aggregate}Repository.ts`.
- **application/use-cases**: `{Feature}ManagementUseCase.ts` o un use case por comando/consulta.
- **infrastructure/api**: `{feature}.controller.ts` o `{recurso}.controller.ts` (ej. `users.controller.ts`, `clients.controller.ts`).
- **infrastructure/persistence**: `{Nombre}Entity.ts`, `TypeOrm{Nombre}Repository.ts`.

---

## Excepciones de naming

- **api-objetivos:** El módulo y servicio se llaman `dashboard` (dashboard.module.ts, dashboard.service.ts) porque el dominio funcional es el dashboard de objetivos. La lib sigue siendo `api-objetivos`; los controllers y la API siguen bajo rutas de objetivos/dashboard.

---

## Referencia

- [plans/HEXAGONAL_ARCHITECTURE.md](../../plans/HEXAGONAL_ARCHITECTURE.md) — Principios y flujo de datos.
- [docs/API_RESPONSES.md](../../docs/API_RESPONSES.md) — Formato de respuestas y errores del API.
