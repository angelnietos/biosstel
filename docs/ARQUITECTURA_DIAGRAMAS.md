# Diagramas de arquitectura – Biosstel

Documentación visual de la arquitectura del monorepo: sistema, frontend, backend y base de datos.

---

## 1. Vista general del sistema

```mermaid
flowchart TB
    subgraph Usuario
        Browser[ Navegador ]
    end

    subgraph Frontend["Frontend (Next.js 16)"]
        App[front-biosstel]
        Shell[Shell: rutas, layout, store]
        Features[Features: auth, usuarios, objetivos, fichajes, etc.]
        App --> Shell
        Shell --> Features
    end

    subgraph Backend["Backend (NestJS)"]
        API[api-biosstel]
        API --> Libs[libs/backend/api-*]
    end

    subgraph BaseDatos["Base de datos"]
        PG[(PostgreSQL)]
    end

    Browser <-->|"HTTP (3000)"| App
    App <-->|"REST (4000)"| API
    API <-->|"TypeORM / SQL"| PG
```

---

## 2. Estructura del monorepo

```mermaid
flowchart LR
    subgraph Apps["apps/"]
        Front[front-biosstel]
        Api[api-biosstel]
    end

    subgraph LibsFront["libs/frontend/"]
        Features[features/]
        UI[ui]
        UILayout[ui-layout]
        Shared[shared]
        Platform[platform]
        Shell[shell]
    end

    subgraph LibsBack["libs/backend/"]
        ApiAuth[api-auth]
        ApiUsers[api-usuarios]
        ApiObjetivos[api-objetivos]
        ApiFichajes[api-fichajes]
        ApiEmpresa[api-empresa]
        ApiProductos[api-productos]
        ApiAlertas[api-alertas]
        ApiOperaciones[api-operaciones]
        ApiShared[api-shared]
    end

    subgraph SharedTypes["libs/shared-types/"]
        Types[Tipos compartidos]
    end

    Front --> Shell
    Front --> Features
    Front --> UI
    Front --> Shared
    Shell --> Features
    Features --> UI
    Features --> Platform
    Api --> LibsBack
    LibsBack --> SharedTypes
    Features --> SharedTypes
```

---

## 3. Arquitectura del Frontend

```mermaid
flowchart TB
    subgraph App["front-biosstel (Next.js App Router)"]
        Router["[locale]/[[...path]]"]
        Providers[Providers: Redux, AuthRestore]
        Router --> Providers
    end

    subgraph Shell["@biosstel/shell"]
        Store[Store global]
        CatchAll[CatchAllPage]
        RouteRegistry[routeRegistry]
        Store --> CatchAll
        RouteRegistry --> CatchAll
    end

    subgraph Features["Features (@biosstel/*)"]
        Auth[auth]
        Usuarios[usuarios]
        Objetivos[objetivos]
        Fichajes[fichajes]
        Empresa[empresa]
        Alertas[alertas]
        Productos[productos]
        Inventory[inventory]
        Reports[reports]
        Operaciones[operaciones]
    end

    subgraph DataAccess["Data-access por feature"]
        Slices[Redux slices]
        Thunks[Thunks → API]
        Hooks[Hooks: useX]
        Slices --> Thunks
        Hooks --> Slices
    end

    subgraph UI["Capas UI"]
        UiLib[@biosstel/ui]
        UiLayout[@biosstel/ui-layout]
        Platform[@biosstel/platform]
    end

    Providers --> Store
    CatchAll --> Features
    Features --> DataAccess
    DataAccess --> UiLib
    DataAccess --> UiLayout
    Thunks -->|"fetch"| API
```

### Flujo de datos en el Frontend (Redux)

```mermaid
sequenceDiagram
    participant Page as Página
    participant Hook as useX (data-access)
    participant Dispatch as dispatch
    participant Thunk as Thunk (createAsyncThunk)
    participant API as api/services
    participant Store as Redux Store

    Page->>Hook: useUsers()
    Hook->>Dispatch: dispatch(fetchUsers())
    Dispatch->>Thunk: ejecuta
    Thunk->>API: getUsers()
    API->>Thunk: datos
    Thunk->>Store: fulfilled(payload)
    Store->>Hook: useSelector(state.users)
    Hook->>Page: { data, loading, error }
```

---

## 4. Arquitectura del Backend (Hexagonal)

```mermaid
flowchart TB
    subgraph API["api-biosstel"]
        Main[main.ts]
        AppModule[AppModule]
        Main --> AppModule
    end

    subgraph Feature["Cada lib api-* (ej. api-usuarios)"]
        subgraph Application["application/"]
            PortsIn[Ports Input]
            PortsOut[Ports Output]
            UseCases[Use Cases]
            PortsIn --> UseCases
            UseCases --> PortsOut
        end

        subgraph Infrastructure["infrastructure/"]
            Controllers[Controllers REST]
            Repositories[Repositories TypeORM]
            Entities[Entities]
            Controllers --> PortsIn
            PortsOut --> Repositories
            Repositories --> Entities
        end
    end

    subgraph DB[(PostgreSQL)]
        Tables[(Tablas)]
    end

    AppModule --> Feature
    Entities --> Tables
```

### Módulos del Backend

```mermaid
flowchart LR
    Api[api-biosstel] --> Auth[api-auth]
    Api --> Users[api-usuarios]
    Api --> Obj[api-objetivos]
    Api --> Fich[api-fichajes]
    Api --> Emp[api-empresa]
    Api --> Prod[api-productos]
    Api --> Alert[api-alertas]
    Api --> Ops[api-operaciones]
    Api --> Shared[api-shared]
```

---

## 5. Base de datos (PostgreSQL) – Modelo entidad-relación

```mermaid
erDiagram
    users ||--o{ fichajes : "userId"
    users ||--o{ tasks : "userId"
    users ||--o{ user_documents : "userId"
    users {
        uuid id PK
        varchar email
        varchar password
        varchar firstName
        varchar lastName
        varchar role
        boolean isActive
    }

    clients {
        uuid id PK
        varchar name
        varchar email
        varchar phone
    }

    user_documents {
        uuid id PK
        uuid userId FK
        varchar name
        varchar mimeType
        text contentBase64
    }

    departments {
        uuid id PK
        varchar name
        varchar code
    }

    work_centers {
        uuid id PK
        varchar name
        varchar code
    }

    fichajes {
        uuid id PK
        uuid userId FK
        date date
        timestamp startTime
        timestamp endTime
        text status
        jsonb pauses
    }

    tasks {
        uuid id PK
        uuid userId FK
        uuid agenda_id FK
        varchar title
        timestamp startTime
        timestamp endTime
        boolean completed
    }

    terminal_objectives {
        uuid id PK
        varchar title
        varchar objectiveType
        varchar period
        int achieved
        int objective
        boolean isActive
    }

    terminal_assignments {
        uuid id PK
        uuid terminalObjectiveId FK
        varchar type
        varchar name
        int achieved
        int objective
    }

    products {
        uuid id PK
        varchar codigo
        varchar nombre
        varchar familia
        varchar estado
    }

    inventory_items {
        uuid id PK
        varchar codigo
        varchar nombre
        int cantidad
        varchar ubicacion
    }

    dashboard_objectives {
        uuid id PK
        varchar label
        int value
    }

    dashboard_alerts {
        uuid id PK
        varchar type
        varchar message
    }

    terminal_objectives ||--o{ terminal_assignments : "id"
```

---

## 6. Flujo de una petición (ejemplo: login)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant Store as Redux Store
    participant API as API (NestJS)
    participant DB as PostgreSQL

    U->>F: Email + contraseña
    F->>Store: dispatch(loginThunk(credentials))
    Store->>API: POST /auth/login
    API->>DB: SELECT user WHERE email
    DB->>API: user
    API->>API: JWT sign
    API->>F: { user, accessToken }
    F->>Store: fulfilled({ user, token })
    Store->>F: state.auth
    F->>U: Redirige a /home
```

---

## 7. Puertos y servicios en desarrollo

```mermaid
flowchart LR
    subgraph Docker["Docker (pnpm start)"]
        Postgres[PostgreSQL :5434]
        Adminer[Adminer :8080]
    end

    subgraph Host["Host"]
        Front[Frontend :3000]
        Api[API :4000]
    end

    Front --> Api
    Api --> Postgres
    Adminer --> Postgres
```

| Servicio   | Puerto | URL                       |
|-----------|--------|---------------------------|
| Frontend  | 3000   | http://localhost:3000    |
| API       | 4000   | http://localhost:4000/api |
| Swagger   | 4000   | http://localhost:4000/api/docs |
| PostgreSQL| 5434   | localhost:5434            |
| Adminer   | 8080   | http://localhost:8080     |

---

## Referencias

- [README principal](../README.md) – Inicio rápido, comandos, troubleshooting.
- [Arquitectura hexagonal](../plans/HEXAGONAL_ARCHITECTURE.md) – Backend.
- [Arquitectura frontend](../plans/arquitectura-front.md) – Features y shell.
- [Store global](../libs/frontend/shell/src/store/README.md) – Redux y composición.
