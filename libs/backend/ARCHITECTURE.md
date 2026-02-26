# Arquitectura estándar de librerías backend

Todas las librerías bajo `libs/backend` siguen **Clean Architecture** con dominio puro, mappers Domain ↔ ORM y separación clara **Read** (queries) / **Write** (commands). Ver **README.md** en esta misma carpeta para la guía completa para desarrolladores.

## Estructura de carpetas

Cada responsabilidad tiene su carpeta; las subresponsabilidades van en subcarpetas por **feature** (productos, inventario, departamentos, etc.):

```
libs/backend/<api-*>/src/
├── domain/
│   ├── entities/                    # Entidades PURAS (sin TypeORM)
│   └── repositories/                # Puertos por feature
│       ├── productos/               # IProductRepository, etc.
│       ├── inventario/
│       └── index.ts
│
├── application/
│   ├── cqrs/                        # CQRS: commands, queries, handlers
│   │   ├── commands/                # WRITE por feature
│   │   │   ├── productos/           # CreateProduct, UpdateProduct, DeleteProduct, …
│   │   │   ├── inventario/
│   │   │   └── index.ts
│   │   ├── queries/                 # READ por feature
│   │   │   ├── productos/           # ListProducts, GetProductById, …
│   │   │   ├── inventario/
│   │   │   └── index.ts
│   │   ├── handlers/                # Handlers por feature
│   │   │   ├── productos/
│   │   │   ├── inventario/
│   │   │   └── index.ts
│   │   └── *MediatorRegistration.ts
│   ├── dto/                         # DTOs por feature (no todo junto)
│   │   ├── productos/               # CreateProductDto, UpdateProductDto
│   │   ├── inventario/
│   │   └── index.ts
│   ├── use-cases/
│   └── ports/
│
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/                # Entidades ORM
│   │   └── repositories/           # Implementaciones por feature
│   │       ├── productos/          # TypeOrmProductRepository
│   │       ├── inventario/
│   │       └── index.ts
│   ├── mappers/
│   └── api/
│       ├── controllers/            # Controllers por feature (no todo en api/)
│       │   ├── productos.controller.ts
│       │   ├── inventory.controller.ts
│       │   └── index.ts
│       └── index.ts
│
└── config/
    └── domain.config.ts
```

## Read vs Write (CQRS)

- **application/cqrs/commands/** (write): por feature (productos, inventario, …). El controller usa `mediator.send(Command)`.
- **application/cqrs/queries/** (read): por feature. El controller usa `mediator.execute(Query)`.
- **application/cqrs/handlers/**: CommandHandlers y QueryHandlers por feature; se registran en `*MediatorRegistration` (OnModuleInit).

## Dominio puro y mappers

- **domain/entities**: clases o tipos **sin** dependencias de TypeORM ni de infraestructura. Pueden exponer `toPlain()` para serialización API.
- **infrastructure/persistence**: entidades ORM (`@Entity()`, `@Column()`). Una por tabla/agregado.
- **infrastructure/mappers**: traducen **Domain ↔ ORM**. El repositorio en infraestructura usa el mapper para devolver entidades de dominio y para persistir a partir de inputs de dominio. Así el dominio no depende de la base de datos ni del framework.

## Input Ports y Output Ports

- **Input Port** (application/ports/input): interfaz de lo que el módulo **ofrece** (ej. IAuthManagement.login). Use Case o Handler la implementa.
- **Output Port** (application/ports/output o domain/repositories): interfaz de lo que el módulo **necesita** (IUserRepository, ITokenService, IHashService). Infraestructura la implementa. No dejar application/ports/output vacío (export {}); definir las interfaces.

## Reglas

- **domain/repositories**: subcarpetas por feature (productos, inventario, departamentos). Solo interfaces; implementaciones en `infrastructure/persistence/repositories/<feature>`.
- **application/dto**: subcarpetas por feature (productos, inventario, …); no todos los DTOs en un solo directorio.
- **infrastructure/api**: subcarpeta `controllers/` con los controllers; no todo junto en `api/`.
- **value-objects, services, mappers**: crear carpetas solo cuando haya contenido; no dejar carpetas vacías.
- **config/domain.config.ts**: constantes y tokens de inyección (p. ej. `PRODUCT_REPOSITORY`, `DEPARTMENT_REPOSITORY`).
- Todas las features deben estar **completas**: comandos de escritura (Create, Update, Delete) y queries de lectura donde aplique.
