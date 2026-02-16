# Biosstel Monorepo

Monorepo para el proyecto Biosstel.

## 🏗️ Arquitectura

### Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 + React 19 |
| Backend | NestJS + REST API |
| Base de datos | PostgreSQL + TypeORM |
| Autenticación | JWT |
| Contenedores | Docker + Docker Compose |

### Estructura

```
biosstel-monorepo/
├── apps/
│   ├── front-biosstel/     # Next.js (Frontend)
│   └── api-biosstel/       # NestJS (REST API)
├── libs/
│   └── shared-types/       # Tipos TypeScript compartidos
├── docker/                 # Docker y scripts de BD
```

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env y asegurar que DB_PORT=5433

# 3. Iniciar base de datos (Docker)
docker-compose -f docker-compose.dev.yml up -d

# 4. Iniciar API (terminal 1)
pnpm dev:api

# 5. Iniciar Frontend (terminal 2)
pnpm dev:front
```

## 📋 Comandos

### Desarrollo

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia todo (frontend + API en paralelo) |
| `pnpm dev:api` | Solo API (puerto 4000) |
| `pnpm dev:front` | Solo Frontend (puerto 3000) |
| `pnpm build` | Build de todo |

### Base de Datos (Docker)

| Comando | Descripción |
|---------|-------------|
| `docker-compose -f docker-compose.dev.yml up -d` | Inicia PostgreSQL |
| `docker-compose -f docker-compose.dev.yml down` | Detiene PostgreSQL |
| `docker-compose -f docker-compose.dev.yml down -v` | Detiene y elimina datos |

### Docker Produccion

| Comando | Descripción |
|---------|-------------|
| `docker-compose -f docker-compose.yml build` | Build de imágenes |
| `docker-compose -f docker-compose.yml up -d` | Inicia todos los servicios |

## 🔌 API REST

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrarse |
| GET | /api/auth/profile | Perfil (auth) |
| GET | /api/users | Listar usuarios (auth) |
| GET | /api/health | Estado de la API |

### URL Base

```
http://localhost:4000/api
```

## 🐳 Docker

### Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 3000 | Next.js |
| API | 4000 | NestJS |
| PostgreSQL | 5433 | Base de datos (usa 5433, no 5432) |
| Adminer | 8080 | Interfaz web para BD |

### Desarrollo

```bash
# Iniciar solo la base de datos
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener
docker-compose -f docker-compose.dev.yml down
```

### Produccion

```bash
# Build y up
docker-compose -f docker-compose.yml up --build -d

# Detener
docker-compose -f docker-compose.yml down
```

## 📦 Estructura del API (NestJS)

```
src/
├── main.ts                 # Entry point
├── app.module.ts           # Root module
└── modules/
    ├── auth/              # Autenticación JWT
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── strategies/
    │   └── guards/
    ├── users/             # Gestión de usuarios
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── entities/
    └── health/            # Health checks
```

## 🔐 Variables de Entorno

El archivo `.env` debe contener:

```env
# Database (IMPORTANTE: usar puerto 5433)
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

## 🏃 Desarrollo

### Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- pnpm

### Pasos para Desarrollo

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Configurar entorno:**
   ```bash
   cp .env.example .env
   ```

3. **Iniciar base de datos:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Ejecutar API (terminal 1):**
   ```bash
   pnpm dev:api
   ```

5. **Ejecutar Frontend (terminal 2):**
   ```bash
   pnpm dev:front
   ```

### URLs de Acceso

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api |
| Health Check | http://localhost:4000/api/health |
| Adminer (BD) | http://localhost:8080 |

### Credenciales de Base de Datos

| Campo | Valor |
|-------|-------|
| Servidor | localhost |
| Puerto | 5433 |
| Usuario | biosstel |
| Contraseña | biosstel123 |
| Base de datos | biosstel |

## 📄 Licencia

ISC

---

## 🧪 Testing

### Tests Unitarios (Vitest)

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests de API
pnpm test:api

# Ejecutar tests de Frontend
pnpm test:front

# Ejecutar tests con UI
pnpm test:ui
```

### Tests E2E (Playwright)

```bash
# Instalar navegadores de Playwright
pnpm playwright:install

# Ejecutar todos los tests E2E
pnpm test:e2e

# Ejecutar tests E2E con UI interactiva
pnpm test:e2e:ui

# Ejecutar solo tests E2E de API
pnpm test:e2e:api

# Ejecutar solo tests E2E de Frontend
pnpm test:e2e:front
```

### Estructura de Tests

```
biosstel-monorepo/
├── apps/
│   ├── api-biosstel/
│   │   └── src/**/*.spec.ts       # Tests unitarios (Vitest)
│   ├── e2e-api/
│   │   ├── playwright.config.ts
│   │   └── tests/                  # Tests E2E de API
│   ├── e2e-front/
│   │   ├── playwright.config.ts
│   │   └── tests/                  # Tests E2E de Frontend
│   └── front-biosstel/
├── vitest.config.ts                # Configuración de Vitest
└── playwright.config.ts            # Configuración de Playwright
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm test` | Ejecutar tests unitarios con Vitest |
| `pnpm test:ui` | Tests unitarios con UI interactiva |
| `pnpm test:api` | Solo tests de la API |
| `pnpm test:front` | Solo tests del Frontend |
| `pnpm test:e2e` | Todos los tests E2E |
| `pnpm test:e2e:ui` | Tests E2E con UI interactiva |
| `pnpm test:e2e:api` | Tests E2E de la API |
| `pnpm test:e2e:front` | Tests E2E del Frontend |
| `pnpm playwright:install` | Instalar navegadores de Playwright |

## 🔄 CI/CD

### GitHub Actions

El proyecto incluye pipelines de CI/CD en `.github/workflows/`:

| Workflow | Descripción | Trigger |
|----------|-------------|---------|
| `ci.yml` | Lint, TypeCheck, Unit Tests, Build | Push/PR a main, master, develop |
| `e2e.yml` | Tests E2E con Playwright | Push/PR a main, master, develop |
| `docker.yml` | Build de imágenes Docker | Push/PR a main, master |

### Jobs del CI

1. **Lint** - Ejecuta ESLint
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
