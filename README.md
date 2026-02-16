# Biosstel Monorepo

Monorepo full-stack modular con arquitectura hexagonal y feature-driven development.

## 🏗️ Arquitectura

### Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Backend | NestJS + REST API + TypeORM |
| Base de datos | PostgreSQL |
| Autenticación | JWT + Passport |
| Monorepo | Nx + pnpm Workspaces |
| Testing | Vitest + Playwright |
| Contenedores | Docker + Docker Compose |
| Desarrollo | tsx (live reload con archivos fuente) |

### Arquitectura Modular Full-Stack

El proyecto sigue una arquitectura **modular y escalable** donde:

- **Frontend**: Features con `pages`, `shell`, `data-access`, `components`
- **Backend**: Features con `domain`, `application`, `infrastructure`, `api`
- **Shared**: Tipos, enums, utils compartidos entre frontend y backend

```
biosstel-monorepo/
├── apps/
│   ├── front-biosstel/          # Next.js Frontend
│   └── api-biosstel/             # NestJS Backend API
├── libs/
│   ├── shared-types/            # Tipos TypeScript compartidos
│   ├── ui/                      # Componentes UI reutilizables
│   ├── ui-layout/               # Layouts y composiciones
│   ├── platform/                # Utilidades de plataforma
│   ├── auth/                    # Feature: Autenticación (frontend)
│   ├── users/                   # Feature: Usuarios (frontend)
│   ├── api-shared/              # Utilidades backend compartidas
│   └── api-users/               # Feature: Usuarios (backend - hexagonal)
└── docker/                      # Dockerfiles y scripts
```

### Diagrama de Dependencias

```
Frontend (Next.js)
  ├── features/* (auth, users, etc.)
  │   ├── shell
  │   ├── data-access
  │   └── pages
  ├── libs/ui (componentes atómicos)
  ├── libs/ui-layout (composiciones)
  └── libs/shared-types (tipos compartidos)

Backend (NestJS)
  ├── libs/api-users (feature hexagonal)
  │   ├── domain
  │   ├── application
  │   └── infrastructure
  ├── libs/api-shared (utilidades)
  └── libs/shared-types (tipos compartidos)
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Docker** y **Docker Compose**
- **PostgreSQL** (o usar Docker)

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd babooni

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Iniciar base de datos
pnpm db:start

# 5. Iniciar todo (frontend + API)
pnpm start:all
# o por separado:
# pnpm dev:api    # Terminal 1
# pnpm dev:front  # Terminal 2
```

## 📋 Comandos Disponibles

### 🎯 Desarrollo

| Comando | Descripción |
|---------|-------------|
| `pnpm start:all` | Inicia frontend + API en paralelo (recomendado) |
| `pnpm start` | Alias de `start:all` |
| `pnpm dev` | Alias de `start:all` |
| `pnpm dev:all` | Alias de `start:all` |
| `pnpm dev:api` | Solo API (puerto 4000) con live reload |
| `pnpm dev:front` | Solo Frontend (puerto 3000) |
| `pnpm start:api` | Alias de `dev:api` |
| `pnpm start:front` | Alias de `dev:front` |

### 🏗️ Build

| Comando | Descripción |
|---------|-------------|
| `pnpm build` | Build completo (API + Frontend) |
| `pnpm build:api` | Solo build de API |
| `pnpm build:front` | Solo build de Frontend |

### 🗄️ Base de Datos (Docker)

| Comando | Descripción |
|---------|-------------|
| `pnpm db:start` | Inicia PostgreSQL + Adminer |
| `pnpm db:stop` | Detiene contenedores |
| `pnpm db:reset` | Detiene y elimina volúmenes (reset completo) |
| `pnpm db:logs` | Ver logs de PostgreSQL |

### 🐳 Docker Producción

| Comando | Descripción |
|---------|-------------|
| `pnpm docker:build` | Build de imágenes Docker |
| `pnpm docker:up` | Inicia todos los servicios |
| `pnpm docker:down` | Detiene todos los servicios |
| `pnpm docker:logs` | Ver logs de contenedores |

### 🔍 Linting y Type Checking

| Comando | Descripción |
|---------|-------------|
| `pnpm lint` | Lint de todos los proyectos |
| `pnpm lint:all` | Alias de `lint` |
| `pnpm lint:api` | Solo lint de API |
| `pnpm lint:front` | Solo lint de Frontend |
| `pnpm typecheck` | Type check de todos los proyectos |
| `pnpm typecheck:api` | Solo type check de API |
| `pnpm typecheck:front` | Solo type check de Frontend |

### 🧪 Testing

| Comando | Descripción |
|---------|-------------|
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:ui` | Tests con UI interactiva |
| `pnpm test:api` | Solo tests de API |
| `pnpm test:front` | Solo tests de Frontend |
| `pnpm test:e2e` | Tests E2E (Playwright) |
| `pnpm test:e2e:ui` | Tests E2E con UI interactiva |
| `pnpm test:e2e:api` | Tests E2E de API |
| `pnpm test:e2e:front` | Tests E2E de Frontend |
| `pnpm test:e2e:all` | Todos los tests E2E |
| `pnpm playwright:install` | Instalar navegadores de Playwright |

### 🔧 Utilidades

| Comando | Descripción |
|---------|-------------|
| `pnpm nx` | Ejecutar comandos de Nx |
| `pnpm ci` | Instalación para CI (frozen lockfile) |

## 🔌 API REST

### Base URL

```
http://localhost:4000/api
```

### Documentación

- **Swagger UI**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/api/health

### Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| POST | `/api/auth/register` | Registrarse | ❌ |
| GET | `/api/auth/profile` | Perfil del usuario | ✅ |
| GET | `/api/users` | Listar usuarios | ✅ |
| GET | `/api/users/:id` | Obtener usuario | ✅ |
| POST | `/api/users` | Crear usuario | ✅ |
| PUT | `/api/users/:id` | Actualizar usuario | ✅ |
| DELETE | `/api/users/:id` | Eliminar usuario | ✅ |

## 🏗️ Arquitectura del Backend

### Arquitectura Hexagonal (Ports & Adapters)

El backend sigue una **arquitectura hexagonal** donde cada feature es una librería independiente:

```
libs/api-users/
├── src/
│   ├── application/
│   │   └── ports/
│   │       └── IUserRepository.ts    # Contrato (puerto)
│   ├── infrastructure/
│   │   └── persistence/
│   │       ├── UserEntity.ts         # Entidad TypeORM
│   │       └── TypeOrmUserRepository.ts  # Implementación (adaptador)
│   ├── users.module.ts               # Módulo NestJS
│   ├── users.service.ts              # Servicio de aplicación
│   └── users.controller.ts          # Controlador REST
└── index.ts                          # Exports públicos
```

### Live Reload con Archivos Fuente

El backend está configurado para usar **archivos fuente directamente** en desarrollo:

- ✅ **Desarrollo**: Usa `tsx watch` con archivos fuente (`libs/*/src/index.ts`)
- ✅ **Producción**: Compila a `dist/` usando `@nx/js:tsc`
- ✅ **Live Reload**: Cambios en librerías se reflejan automáticamente
- ✅ **Sin compilación previa**: No necesitas compilar librerías antes de desarrollar

**Configuración**:
- `apps/api-biosstel/tsconfig.dev.json` - Paths a archivos fuente
- `apps/api-biosstel/dev.ts` - Entry point con `reflect-metadata` y `tsconfig-paths`
- `apps/api-biosstel/project.json` - Target `dev` usa `tsx watch`

## 🎨 Arquitectura del Frontend

### Feature-Driven Development

Cada feature tiene su propia estructura:

```
libs/users/ (o libs/auth/)
├── src/
│   ├── shell/              # Lógica de presentación
│   ├── data-access/        # Hooks y servicios API
│   ├── components/         # Componentes específicos
│   └── pages/              # Páginas Next.js
└── index.ts
```

### Librerías Compartidas

- **`libs/ui`**: Componentes UI atómicos reutilizables
- **`libs/ui-layout`**: Layouts y composiciones
- **`libs/platform`**: Utilidades de plataforma
- **`libs/shared-types`**: Tipos TypeScript compartidos con backend

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USER=biosstel
DB_PASSWORD=biosstel123
DB_NAME=biosstel
DATABASE_URL=postgresql://biosstel:biosstel123@localhost:5433/biosstel

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# App
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Credenciales de Base de Datos (Desarrollo)

| Campo | Valor |
|-------|-------|
| Servidor | localhost |
| Puerto | **5433** (importante: no 5432) |
| Usuario | biosstel |
| Contraseña | biosstel123 |
| Base de datos | biosstel |

## 🐳 Docker

### Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| API | 4000 | http://localhost:4000/api |
| PostgreSQL | 5433 | localhost:5433 |
| Adminer | 8080 | http://localhost:8080 |

### Desarrollo

```bash
# Iniciar solo la base de datos
pnpm db:start

# Ver logs
pnpm db:logs

# Detener
pnpm db:stop

# Reset completo (elimina datos)
pnpm db:reset
```

### Producción

```bash
# Build y up
docker-compose -f docker-compose.yml up --build -d

# Ver logs
pnpm docker:logs

# Detener
pnpm docker:down
```

## 📦 Estructura de Librerías

### Backend Libraries (`libs/api-*`)

Cada feature backend es una librería independiente con arquitectura hexagonal:

- **`api-users`**: Feature de usuarios (domain, application, infrastructure)
- **`api-shared`**: Utilidades compartidas del backend

### Frontend Libraries (`libs/*`)

- **`auth`**: Feature de autenticación
- **`users`**: Feature de usuarios
- **`ui`**: Componentes UI atómicos
- **`ui-layout`**: Layouts y composiciones
- **`platform`**: Utilidades de plataforma

### Shared Libraries

- **`shared-types`**: Tipos TypeScript compartidos entre frontend y backend

## 🔄 Paths y Imports

### Paths Configurados

El proyecto usa paths de TypeScript para imports limpios:

```typescript
// Backend
import { UsersModule } from '@lib/api-users';
import { UserEntity } from '@biosstel/api-users';

// Frontend
import { Button } from '@biosstel/ui';
import { useUsers } from '@biosstel/users';
import { User } from '@biosstel/shared-types';
```

### Configuración

- **`tsconfig.base.json`**: Paths base del monorepo
- **`apps/api-biosstel/tsconfig.dev.json`**: Paths para desarrollo (archivos fuente)
- **`apps/api-biosstel/tsconfig.app.json`**: Paths para producción (archivos compilados)

## 🧪 Testing

### Tests Unitarios (Vitest)

```bash
# Ejecutar todos los tests
pnpm test

# Tests con UI interactiva
pnpm test:ui

# Tests específicos
pnpm test:api
pnpm test:front
```

### Tests E2E (Playwright)

```bash
# Instalar navegadores
pnpm playwright:install

# Ejecutar tests E2E
pnpm test:e2e

# Tests E2E con UI interactiva
pnpm test:e2e:ui

# Tests específicos
pnpm test:e2e:api
pnpm test:e2e:front
```

### Estructura de Tests

```
biosstel-monorepo/
├── apps/
│   ├── api-biosstel/
│   │   └── src/**/*.spec.ts       # Tests unitarios
│   ├── e2e-api/
│   │   └── tests/                  # Tests E2E de API
│   └── e2e-front/
│       └── tests/                  # Tests E2E de Frontend
├── vitest.config.ts
└── playwright.config.ts
```

## 🚀 Desarrollo

### Workflow Recomendado

1. **Iniciar base de datos**:
   ```bash
   pnpm db:start
   ```

2. **Iniciar todo en desarrollo**:
   ```bash
   pnpm start:all
   ```

3. **Desarrollar**:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000/api
   - Swagger: http://localhost:4000/api/docs
   - Adminer: http://localhost:8080

### Live Reload

- ✅ **Frontend**: Hot reload automático con Next.js
- ✅ **Backend**: Live reload con `tsx watch` usando archivos fuente
- ✅ **Librerías**: Cambios en `libs/*` se reflejan automáticamente sin compilar

### URLs de Acceso

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api |
| Swagger Docs | http://localhost:4000/api/docs |
| Health Check | http://localhost:4000/api/health |
| Adminer (BD) | http://localhost:8080 |

## 📚 Documentación Adicional

- **Arquitectura API**: `plans/arquitectura-api.md`
- **Arquitectura Frontend**: `plans/arquitectura-front.md`

## 🔄 CI/CD

### GitHub Actions

El proyecto incluye pipelines de CI/CD en `.github/workflows/`:

| Workflow | Descripción | Trigger |
|----------|-------------|---------|
| `ci.yml` | Lint, TypeCheck, Unit Tests, Build | Push/PR a main, master, develop |
| `e2e.yml` | Tests E2E con Playwright | Push/PR a main, master, develop |
| `docker.yml` | Build de imágenes Docker | Push/PR a main, master |

### Jobs del CI

1. **Lint** - Ejecuta ESLint en todos los proyectos
2. **TypeCheck** - Verifica tipos TypeScript
3. **Unit Tests** - Ejecuta tests con Vitest
4. **Build** - Compila API y Frontend

### Jobs del E2E

1. **Install dependencies** - Instala dependencias
2. **Install Playwright browsers** - Instala navegadores
3. **Start PostgreSQL** - Inicia base de datos
4. **Start API** - Inicia servidor API
5. **Start Frontend** - Inicia servidor Frontend
6. **Run E2E tests** - Ejecuta tests E2E

## 🎯 Características Principales

### ✅ Arquitectura Modular

- Features extraíbles y reutilizables
- Librerías compartidas entre frontend y backend
- Separación clara de responsabilidades

### ✅ Live Reload Avanzado

- Backend usa archivos fuente directamente en desarrollo
- No requiere compilar librerías antes de desarrollar
- Cambios se reflejan automáticamente

### ✅ Type Safety Full-Stack

- Tipos compartidos entre frontend y backend
- Sin desincronización de tipos
- DTOs y Value Objects definidos una sola vez

### ✅ Escalabilidad

- Fácil agregar nuevas features
- Features pueden extraerse a microservicios
- Arquitectura preparada para crecimiento

## 📄 Licencia

ISC

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para preguntas o problemas, abre un issue en el repositorio.
