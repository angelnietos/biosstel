# 🏗️ Arquitectura Hexagonal Completa - Backend

Este proyecto implementa **Arquitectura Hexagonal (Ports & Adapters)** en todas las librerías backend.

---

## 📐 Estructura de Capas

```
libs/backend/api-{feature}/
├── application/                     # 🟢 Capa de Aplicación (Use Cases)
│   ├── ports/
│   │   ├── input/                  # ⬅️ Input Ports (Interfaces para Use Cases)
│   │   └── output/                 # ➡️ Output Ports (Interfaces para Repositorios)
│   └── use-cases/                  # Use Cases (Lógica de aplicación)
│
└── infrastructure/                  # 🟡 Capa de Infraestructura (Adapters)
    ├── api/                        # Input Adapters (Controllers REST, GraphQL)
    └── persistence/                # Output Adapters (TypeORM Entities + Repositories)
```

> **Nota sobre `domain/`**: En este proyecto NO usamos una capa de dominio separada porque:
> - Las **entidades TypeORM** ya están en `infrastructure/persistence` (son infraestructura, no dominio puro)
> - La **lógica de negocio** está en los Use Cases (suficiente para este proyecto)
> - Solo crearíamos `domain/` si necesitáramos entidades TypeScript puras sin decoradores o lógica de dominio compleja

---

## 🎯 Principios de la Arquitectura Hexagonal

### 1️⃣ **Application** (Use Cases + Ports)
- ✅ Orquesta la lógica de negocio
- ✅ Define **Input Ports** (qué puede hacer el sistema)
- ✅ Define **Output Ports** (qué necesita el sistema del exterior)
- ✅ No conoce implementaciones concretas (solo interfaces)

### 2️⃣ **Infrastructure** (Adapters)
- ✅ **Input Adapters**: Controllers REST que implementan interfaces de la aplicación
- ✅ **Output Adapters**: Repositorios + Entidades TypeORM
- ✅ Conoce frameworks (NestJS, TypeORM, etc.)
- ✅ Es la **única capa que puede cambiar** sin afectar el negocio

---

## 📦 Ejemplo: `api-users`

### Estructura Real

```
libs/backend/api-users/
├── src/
│   ├── application/
│   │   ├── ports/
│   │   │   ├── input/
│   │   │   │   ├── IUserManagement.ts      # ⬅️ Qué puedo hacer con usuarios
│   │   │   │   └── index.ts
│   │   │   ├── output/
│   │   │   │   ├── IUserRepository.ts      # ➡️ Qué necesito de la BD
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── use-cases/
│   │       ├── UserManagementUseCase.ts    # 🎯 Implementa IUserManagement
│   │       └── index.ts
│   │
│   ├── infrastructure/
│   │   ├── api/
│   │   │   ├── users.controller.ts         # ⬅️ Input Adapter (REST)
│   │   │   └── index.ts
│   │   └── persistence/
│   │       ├── UserEntity.ts               # ➡️ TypeORM Entity
│   │       ├── TypeOrmUserRepository.ts    # ➡️ Output Adapter (TypeORM Repo)
│   │       └── index.ts
│   │
│   ├── users.module.ts                     # NestJS Module (conecta todo)
│   ├── users.service.ts                    # Legacy (para retrocompatibilidad)
│   └── index.ts                            # Exports públicos
└── package.json
```

---

## 🔄 Flujo de Datos

```
┌──────────────────────────────────────────────────────────────────┐
│  1. Cliente HTTP                                                 │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  2. Infrastructure: Controller (Input Adapter)                    │
│     - users.controller.ts                                        │
│     - Valida HTTP request                                        │
│     - Convierte DTO → Domain                                     │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  3. Application: Use Case                                         │
│     - UserManagementUseCase                                      │
│     - Aplica reglas de negocio                                   │
│     - Usa Output Port (IUserRepository)                          │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  4. Infrastructure: Repository + Entity (Output Adapter)          │
│     - TypeOrmUserRepository                                      │
│     - UserEntity (con decoradores @Entity, @Column)              │
│     - Guarda en PostgreSQL                                       │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  5. PostgreSQL                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 💡 Ejemplo de Código

### Input Port (Interface)

```typescript
// application/ports/input/IUserManagement.ts
export interface IUserManagement {
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User>;
  create(data: CreateUserData): Promise<User>;
  // ...
}
```

### Use Case (Implementation)

```typescript
// application/use-cases/UserManagementUseCase.ts
@Injectable()
export class UserManagementUseCase implements IUserManagement {
  constructor(
    private readonly userRepository: TypeOrmUserRepository, // Output Port
  ) {}

  async create(data: CreateUserData): Promise<User> {
    // Business rule: Email must be unique
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }
    return this.userRepository.create(data);
  }
}
```

### Controller (Input Adapter)

```typescript
// infrastructure/api/users.controller.ts
@Controller('users')
export class UsersController {
  constructor(
    private readonly userManagement: UserManagementUseCase, // Usa Use Case
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userManagement.create(dto); // Delega al Use Case
  }
}
```

---

## ✅ Ventajas de esta Arquitectura

| Ventaja | Descripción |
|---------|-------------|
| 🔄 **Testeable** | Puedes testear Use Cases sin base de datos (mocks) |
| 🔌 **Desacoplado** | Cambiar de TypeORM a Prisma no afecta los Use Cases |
| 📦 **Modular** | Cada feature es independiente y reutilizable |
| 🛡️ **Protegido** | La lógica de negocio no depende de frameworks |
| 🚀 **Escalable** | Fácil añadir nuevos adapters (GraphQL, gRPC, etc.) |

---

## 🔧 Cómo Agregar una Nueva Feature

1. **Crear estructura**:
```bash
cd libs/backend
mkdir -p api-nueva-feature/src/{application/{ports/{input,output},use-cases},infrastructure/{api,persistence}}
```

2. **Definir Input Port** (qué puede hacer el sistema):
```typescript
// application/ports/input/INuevaFeatureManagement.ts
export interface INuevaFeatureManagement {
  doSomething(data: SomeData): Promise<Result>;
}
```

3. **Definir Output Port** (qué necesita):
```typescript
// application/ports/output/INuevaFeatureRepository.ts
export interface INuevaFeatureRepository {
  save(entity: Entity): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
}
```

4. **Crear Use Case**:
```typescript
// application/use-cases/NuevaFeatureUseCase.ts
@Injectable()
export class NuevaFeatureUseCase implements INuevaFeatureManagement {
  constructor(
    private readonly repository: TypeOrmNuevaFeatureRepository,
  ) {}

  async doSomething(data: SomeData): Promise<Result> {
    // Business logic here
    return this.repository.save(entity);
  }
}
```

5. **Crear Adapters**:
- **Input**: Controller REST en `infrastructure/api/`
- **Output**: TypeORM Entity + Repository en `infrastructure/persistence/`

6. **Conectar en NestJS Module**:
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [NuevaFeatureController],
  providers: [NuevaFeatureUseCase, TypeOrmNuevaFeatureRepository],
  exports: [NuevaFeatureUseCase],
})
export class NuevaFeatureModule {}
```

---

## 📚 Referencias

- **Alistair Cockburn**: [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- **Netflix**: [Ready for changes with Hexagonal Architecture](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)
- **Robert C. Martin**: Clean Architecture

---

**Última actualización**: Febrero 2026
