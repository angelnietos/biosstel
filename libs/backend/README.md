# Backend – Clean Architecture

Este documento describe la arquitectura de las librerías en `libs/backend` para desarrolladores. El objetivo es mantener un **dominio puro** (agnóstico de frameworks) y una **separación clara** entre lectura (queries) y escritura (commands), con **mappers** entre capas que hablan modelos distintos.

---

## 1. Capas y responsabilidades

```
Controller (HTTP)  →  Use Case (Application)  →  Domain  →  Repository (port)
       ↓                        ↓                    ↓              ↓
   Request/DTO              Commands/Queries    Entities (puros)  Interface
       ↓                        ↓                    ↓              ↓
   Infrastructure          Handlers + DTOs      Sin TypeORM    Implementación (ORM)
```

- **Domain**: entidades y reglas de negocio. **Sin dependencias de TypeORM, Nest ni de infraestructura.**
- **Application**: casos de uso, commands (escritura), queries (lectura), DTOs. Orquesta el dominio y los puertos.
- **Infrastructure**: persistencia (ORM), controladores HTTP, mappers Domain ↔ ORM.

---

## 2. Los 3 tipos de transformación

En Clean Architecture hay **tres fronteras** donde se traducen modelos:

| Origen        | Destino    | Dónde              | Qué usar                    |
|---------------|------------|--------------------|-----------------------------|
| Request HTTP  | Entrada UC | Controller / Pipe  | **DTO** (validación, Swagger) |
| DTO / entrada | Dominio    | Use case / Handler | **Domain input** (CreateXxxInput, etc.) |
| Domain        | ORM        | Persistencia       | **Mapper** (infrastructure/mappers) |

### 2.1 Request → DTO (capa HTTP)

El controller recibe el body/query y lo valida con un **DTO** (class-validator, Swagger). Los DTOs viven en `application/dto` y definen la forma de entrada para la aplicación.

```ts
// application/dto/CreateProductDto.ts
export class CreateProductDto {
  @IsString() codigo!: string;
  @IsString() nombre!: string;
  // ...
}
```

### 2.2 DTO → Domain (capa aplicación)

El handler o use case convierte el DTO en **datos que entiende el dominio** (p. ej. `CreateProductInput`). El repositorio (puerto) trabaja siempre con **entidades de dominio** o con estos inputs, nunca con entidades ORM.

### 2.3 Domain ↔ ORM (capa infraestructura) – **Mappers**

Aquí es donde los **mappers** son obligatorios.

- **Entidad de dominio**: clase o tipo **puro**, sin decoradores de TypeORM.
- **Entidad ORM**: clase con `@Entity()`, `@Column()`, etc., en `infrastructure/persistence`.
- **Mapper**: en `infrastructure/mappers` traduce en ambos sentidos.

**Por qué no usar la entidad ORM en el dominio:**

Si el dominio usara la entidad ORM, dependería de TypeORM, de la base de datos y de la infraestructura. Eso **rompe** Clean Architecture. El dominio debe poder expresarse sin conocer ningún framework.

**Ejemplo (api-productos):**

```ts
// domain/entities/Product.ts – PURO
export class Product {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly familia: string,
    // ...
  ) {}
  toPlain() { /* serialización para API */ }
}

// infrastructure/persistence/ProductOrmEntity.ts – ORM
@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  // ...
}

// infrastructure/mappers/ProductMapper.ts
export class ProductMapper {
  static toDomain(orm: ProductOrmEntity): Product {
    return new Product(orm.id, orm.name, orm.familia, ...);
  }
  static toOrmCreate(data: CreateProductInput) { /* ... */ }
  static applyUpdate(orm: ProductOrmEntity, input: UpdateProductInput) { /* ... */ }
}
```

El **repositorio** en infraestructura usa el mapper: lee ORM → `toDomain` → devuelve `Product`; escribe recibiendo dominio o input → `toOrmCreate` / `applyUpdate` → guarda la entidad ORM.

---

## 3. Read (queries) y Write (commands) separados

La aplicación separa explícitamente **lectura** y **escritura**:

| Carpeta                       | Contenido      | Uso desde el controller        |
|-------------------------------|----------------|---------------------------------|
| `application/cqrs/commands/<feature>/` | Write (CUD)    | `mediator.send(new CreateXxxCommand(dto))` |
| `application/cqrs/queries/<feature>/`   | Read           | `mediator.execute(new GetXxxQuery(...))`   |
| `application/cqrs/handlers/<feature>/`  | Command/Query handlers | Registrados en `*MediatorRegistration` |

- **Commands**: crear, actualizar, eliminar. Cada uno tiene su clase Command y su CommandHandler.
- **Queries**: listar, obtener por ID, etc. Cada una tiene su clase Query y su QueryHandler.

Los handlers llaman a use cases o a repositorios inyectados por **puerto** (interfaz en dominio). El resultado del dominio (entidad) se convierte a **forma plana** (`.toPlain()`) en el handler antes de devolverlo al controller, para mantener el contrato de la API (p. ej. shared-types).

---

## 4. Estructura de carpetas estándar

Cada lib `api-*` organiza por **responsabilidad** y por **feature** (productos, inventario, departamentos, …): nada mezclado en un solo directorio.

```
src/
├── domain/
│   ├── entities/                    # Entidades PURAS (sin TypeORM)
│   └── repositories/                # Puertos por feature
│       ├── productos/               # IProductRepository
│       ├── inventario/
│       └── index.ts
│
├── application/
│   ├── cqrs/                        # CQRS: commands, queries, handlers
│   │   ├── commands/                # WRITE por feature
│   │   │   ├── productos/          # CreateProduct, UpdateProduct, DeleteProduct, …
│   │   │   ├── inventario/
│   │   │   └── index.ts
│   │   ├── queries/                 # READ por feature
│   │   │   ├── productos/          # ListProducts, GetProductById, …
│   │   │   └── index.ts
│   │   ├── handlers/                # Handlers por feature
│   │   │   ├── productos/
│   │   │   └── index.ts
│   │   └── *MediatorRegistration.ts
│   ├── dto/                         # DTOs por feature (no todo junto)
│   │   ├── productos/              # CreateProductDto, UpdateProductDto
│   │   ├── inventario/
│   │   └── index.ts
│   ├── use-cases/
│   └── ports/
│
├── infrastructure/
│   ├── persistence/
│   │   ├── entities/                # Entidades ORM
│   │   └── repositories/            # Implementaciones por feature
│   │       ├── productos/           # TypeOrmProductRepository
│   │       ├── inventario/
│   │       └── index.ts
│   ├── mappers/
│   └── api/
│       ├── controllers/             # Controllers por feature (no todo en api/)
│       │   ├── productos.controller.ts
│       │   ├── inventory.controller.ts
│       │   └── index.ts
│       └── index.ts
│
└── config/
    └── domain.config.ts
```

- **No** dejar carpetas vacías (value-objects, services, mappers) si no tienen contenido.
- **Sí** usar mappers en toda entidad que tenga persistencia ORM y entidad de dominio pura.
- **Sí** tener cada feature **completa**: comandos de escritura (Create, Update, Delete) y queries de lectura donde aplique.

---

## 5. Regla mental para mappers

> Si cambias de **tecnología**, **capa** o **modelo conceptual**, necesitas un mapper.

- Request → DTO: validación / DTO.
- DTO → Domain: input del use case / handler.
- **Domain ↔ ORM: mapper en infrastructure.**

Los mappers **no** son para “adaptar lo que viene del frontend”; eso es DTO + validación. Los mappers importantes son los que **desacoplan el dominio de la persistencia** (Domain ↔ ORM).

---

## 6. Referencias en el repo

- **api-productos**: dominio `Product` (puro), `ProductOrmEntity`, `ProductMapper`, puerto `IProductRepository`, handlers que devuelven `.toPlain()`.
- **api-empresa**: dominio `Department`, `DepartmentEntity` (ORM), `DepartmentMapper`, puerto `IDepartmentRepository`, misma idea.
- **ARCHITECTURE.md**: resumen de estructura y reglas de las libs backend.

Si añades una nueva entidad con persistencia, aplica el mismo patrón: entidad de dominio pura, entidad ORM, mapper, y puerto en dominio con implementación en infraestructura.

---

## 7. Input Ports y Output Ports (hexagonal)

- **Input Port** = cómo entra el mundo externo a tu aplicación. Es una **interfaz** que define lo que la aplicación **ofrece** (acciones de negocio: "crear usuario", "login", "generar reporte"). El **Use Case (o Handler) la implementa**; el Controller depende de la interfaz, no del caso concreto.
- **Output Port** = cómo tu aplicación **sale hacia el exterior**. Es una **interfaz** que define lo que la aplicación **necesita** (BD, JWT, bcrypt, emails, servicios externos). La **infraestructura la implementa**; el Use Case depende del puerto, no de Postgres ni de JwtService.

**Regla mental:** si toca BD, servicio externo, JWT, bcrypt, envío de emails → **Output Port**. Si representa una acción de negocio → **Input Port**.

Estructura típica:

- `application/ports/input/` – interfaces tipo `IAuthManagement`, `IProductosManagement` (lo que el módulo ofrece).
- `application/ports/output/` – interfaces tipo `ITokenService`, `IHashService`; los repositorios suelen estar en `domain/repositories` (también son output ports).

**No** dejar `application/ports/output` con solo `export {}`. Definir las interfaces que el caso de uso necesita (aunque la implementación sea un adapter sobre JwtService, etc.).

---

## 8. Persistencia en subcarpetas

La carpeta `infrastructure/persistence` se organiza en subcarpetas:

- `persistence/entities/` – entidades ORM (TypeORM). Solo modelos de tabla.
- `persistence/repositories/` – implementaciones de los repositorios (TypeOrmXxxRepository).

Así no se mezclan entidades, repositorios y tipos en la misma raíz. El `persistence/index.ts` reexporta desde `entities` y `repositories`.
