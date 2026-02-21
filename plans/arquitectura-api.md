# Arquitectura API - Backend modular (Hexagonal)

## Visión general

El backend aplica **Arquitectura Hexagonal (Ports & Adapters)** y diseño por **features** en NestJS:

- **Independencia:** Cada feature es una librería en `libs/backend/api-*`, sin dependencias cruzadas entre features.
- **Testabilidad:** Application (use cases) se puede testear con mocks de los output ports.
- **Extraíble:** Cada feature puede compilarse y reutilizarse de forma aislada.
- **Mantenibilidad:** Código organizado por dominio (feature) y por capas (application / infrastructure).

Documentación detallada de capas y flujo: [HEXAGONAL_ARCHITECTURE.md](./HEXAGONAL_ARCHITECTURE.md).

---

## Estructura de librerías (libs/backend)

```
libs/backend/
├── shared-types/          # Tipos compartidos (front + backend)
├── api-shared/            # Utilidades transversales (métricas, logging)
├── api-auth/              # Auth: login, forgot-password, JWT
├── api-usuarios/          # Usuarios: CRUD, roles
├── api-objetivos/         # Objetivos: dashboard, terminales, asignaciones
├── api-fichajes/          # Fichajes: control jornada, horarios, permisos
├── api-alertas/           # Alertas y notificaciones
├── api-operaciones/       # Operaciones por rol (comercial, telemarketing, tienda, backoffice)
└── api-empresa/           # Estructura: departamentos, centros trabajo, cuentas contables
```

Cada `api-*` (salvo api-shared) sigue la misma estructura hexagonal.

---

## Capas por feature (sin domain/ explícito)

En este proyecto **no** usamos una carpeta `domain/` separada: las entidades TypeORM viven en `infrastructure/persistence` y la lógica de negocio en los use cases. Ver [HEXAGONAL_ARCHITECTURE.md](./HEXAGONAL_ARCHITECTURE.md#-estructura-de-capas).

### 1. Application (`application/`)

- **ports/input:** interfaces que exponen los use cases (ej. `IUserManagement`, `IFichajesManagement`).
- **ports/output:** interfaces que el use case necesita del exterior (ej. `IUserRepository`).
- **use-cases:** clases que implementan los input ports y orquestan la lógica usando los output ports.

Reglas: sin NestJS ni HTTP en la firma; sin conocer TypeORM ni implementaciones concretas.

### 2. Infrastructure (`infrastructure/`)

- **api/:** input adapters (controllers REST) que reciben HTTP y llaman a los use cases.
- **persistence/:** output adapters (TypeORM entities + repositorios que implementan los output ports).

Reglas: aquí se usa NestJS, TypeORM, etc.; se puede cambiar un adaptador sin tocar la aplicación.

---

## Flujo de una petición

1. **Cliente HTTP** → Controller (`infrastructure/api`).
2. **Controller** → Use case (inyectado).
3. **Use case** → Output port (interfaz); la implementación real es el repositorio TypeORM.
4. **Repositorio** → Base de datos.

---

## Registro en la aplicación

Cada feature exporta un **NestJS Module** que se importa en `apps/api-biosstel/src/app.module.ts`. Los paths `@biosstel/api-*` están definidos en:

- `tsconfig.base.json`
- `apps/api-biosstel/tsconfig.json`, `tsconfig.build.json`, `tsconfig.dev.json`

Para **añadir una nueva feature** backend: crear la estructura bajo `libs/backend/api-nueva-feature/`, añadir el alias en los tsconfig, crear `project.json` y `package.json`, y registrar el módulo en `app.module.ts`. Ver [HEXAGONAL_ARCHITECTURE.md](./HEXAGONAL_ARCHITECTURE.md#-cómo-agregar-una-nueva-feature).

---

## Beneficios

| Beneficio     | Descripción                                                     |
| ------------- | --------------------------------------------------------------- |
| Testabilidad  | Use cases testeables con mocks de repositorios                  |
| Flexibilidad  | Cambiar TypeORM por otro ORM sin tocar use cases                |
| Modularidad   | Cada feature es una librería con build y dependencias claras    |
| Escalabilidad | Fácil añadir nuevos adapters (p. ej. GraphQL) o nuevas features |

---

## Estado actual

- **api-shared:** utilidades y métricas.
- **api-auth, api-usuarios, api-objetivos:** con controladores, use cases y persistencia TypeORM según corresponda.
- **api-fichajes, api-alertas, api-operaciones, api-empresa:** scaffolding hexagonal (controllers + use cases placeholder; persistence vacío o por implementar).

Referencia de implementación completa: `libs/backend/api-usuarios` y `libs/backend/api-objetivos`.
