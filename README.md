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

- **Node.js** >= 20.0.0 ([Descargar](https://nodejs.org/))
- **pnpm** >= 8.0.0 (`npm install -g pnpm`)
- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop/))
- **Git** ([Descargar](https://git-scm.com/))

### Instalación Paso a Paso

#### 1️⃣ Clonar e Instalar Dependencias

```bash
# Clonar el repositorio
git clone <repository-url>
cd babooni

# Instalar todas las dependencias del monorepo
pnpm install
```

#### 2️⃣ Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo (si existe)
cp .env.example .env

# O crear .env manualmente con:
```

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```env
# ===========================================
# Database Configuration
# ===========================================
DATABASE_URL=postgresql://biosstel:biosstel123@localhost:5433/biosstel
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USER=biosstel
DATABASE_PASSWORD=biosstel123
DATABASE_NAME=biosstel

# Database Configuration (for API)
DB_HOST=localhost
DB_PORT=5433
DB_USER=biosstel
DB_PASSWORD=biosstel123
DB_NAME=biosstel

# ===========================================
# JWT Configuration
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# ===========================================
# API Configuration
# ===========================================
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# ===========================================
# Frontend Configuration
# ===========================================
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

#### 3️⃣ Iniciar la Base de Datos (Docker)

```bash
# Iniciar PostgreSQL + Adminer en Docker
pnpm db:start

# Verificar que esté corriendo
docker ps | grep postgres
# Deberías ver: biosstel-postgres-dev   Up X minutes   0.0.0.0:5433->5432/tcp
```

**Acceso a la base de datos**:
- **Host**: localhost
- **Puerto**: 5433 ⚠️ (no 5432)
- **Usuario**: biosstel
- **Contraseña**: biosstel123
- **Base de datos**: biosstel
- **Adminer Web UI**: http://localhost:8080

#### 4️⃣ Poblar la Base de Datos (Seed)

```bash
# Ejecutar seed para crear usuarios, objetivos y alertas de prueba
pnpm db:seed
```

**Resultado esperado**:
```
🌱 Starting database seed...
✅ Connected to database
📝 Creating seed users...
✅ Created user: admin@biosstel.com (Password: admin123)
✅ Created user: coordinador@biosstel.com (Password: coord123)
✅ Created user: usuario@biosstel.com (Password: user123)
🧩 Seeding dashboard objectives...
✅ Seeded dashboard objectives
🚨 Seeding dashboard alerts...
✅ Seeded dashboard alerts
🎯 Seeding terminal objectives...
✅ Seeded terminal objectives + assignments
🎉 Seed completed successfully!
```

**Usuarios de prueba creados**:
| Email | Password | Rol |
|-------|----------|-----|
| admin@biosstel.com | admin123 | Administrador |
| coordinador@biosstel.com | coord123 | Coordinador |
| usuario@biosstel.com | user123 | Usuario |

#### 5️⃣ Iniciar el Proyecto

**Opción A - Todo junto (Recomendado)**:
```bash
# Inicia Backend (puerto 4000) + Frontend (puerto 3000) en paralelo
pnpm start:all
```

**Opción B - Por separado**:
```bash
# Terminal 1 - Backend
pnpm dev:api

# Terminal 2 - Frontend
pnpm dev:front
```

#### 6️⃣ Verificar que Todo Funciona

Abre tu navegador y accede a:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🌐 **Frontend** | http://localhost:3000 | Aplicación web principal |
| 🔌 **API** | http://localhost:4000/api | API REST |
| 📖 **Swagger Docs** | http://localhost:4000/api/docs | Documentación interactiva de la API |
| 💚 **Health Check** | http://localhost:4000/api/health | Estado del servidor |
| 🗄️ **Adminer** | http://localhost:8080 | Administrador de base de datos |

**Prueba de login**:
1. Ve a http://localhost:3000
2. Inicia sesión con:
   - **Email**: `admin@biosstel.com`
   - **Password**: `admin123`

---

### 🔄 Comandos Útiles del Día a Día

```bash
# Si necesitas resetear la base de datos
pnpm db:reset          # Elimina todos los datos
pnpm db:seed           # Vuelve a poblar

# Si cambias el schema de TypeORM
# No necesitas hacer nada - synchronize:true en dev
# Los cambios se aplican automáticamente

# Ver logs de la base de datos
pnpm db:logs

# Detener la base de datos
pnpm db:stop

# Reiniciar servicios
# Ctrl+C en las terminales y volver a ejecutar pnpm start:all
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
| `pnpm db:start` | Inicia PostgreSQL + Adminer en Docker |
| `pnpm db:stop` | Detiene contenedores de base de datos |
| `pnpm db:reset` | Detiene y elimina volúmenes (reset completo) |
| `pnpm db:logs` | Ver logs de PostgreSQL en tiempo real |
| `pnpm db:seed` | **Poblar base de datos con datos de prueba** |

#### 📊 Sobre el Seed de Datos

El comando `pnpm db:seed` crea datos de prueba para desarrollo:

**Usuarios**:
- 3 usuarios con diferentes roles (admin, coordinador, usuario)
- Contraseñas hasheadas con bcrypt

**Dashboard**:
- 4 objetivos (Terminales, Familia Y, Familia, Producto X)
- 7 alertas de usuarios con diferentes estados
- 1 objetivo terminal con 24 asignaciones (departamentos + personas)

**Características**:
- ✅ **Idempotente**: Puedes ejecutarlo múltiples veces sin duplicar datos
- ✅ **TypeORM entities**: Usa las entidades TypeORM directamente
- ✅ **Desarrollo rápido**: Datos listos para probar el dashboard inmediatamente

**Cuándo ejecutarlo**:
- ✅ Primera vez que configuras el proyecto
- ✅ Después de `pnpm db:reset` (elimina todos los datos)
- ✅ Cuando necesitas restaurar datos de prueba

**Archivo**: `apps/api-biosstel/seed.ts`

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
- **Configuración TypeScript**: `apps/api-biosstel/TSCONFIG.md`

---

## 🔧 Troubleshooting

### Problemas Comunes

#### ❌ "Cannot find module '@biosstel/...'"

**Causa**: Los paths de TypeScript no están configurados correctamente o el IDE necesita reiniciarse.

**Solución**:
```bash
# 1. Reiniciar el TypeScript Language Server
# En VSCode/Cursor: Cmd/Ctrl + Shift + P → "Restart TS Server"

# 2. Verificar que las dependencias estén instaladas
pnpm install

# 3. Si persiste, limpiar y reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

#### ❌ "Error: connect ECONNREFUSED localhost:5433"

**Causa**: La base de datos no está corriendo.

**Solución**:
```bash
# Verificar si Docker está corriendo
docker ps

# Si no hay contenedores, iniciar la base de datos
pnpm db:start

# Verificar que el contenedor esté corriendo
docker ps | grep postgres
# Debería mostrar: biosstel-postgres-dev   Up X minutes   0.0.0.0:5433->5432/tcp
```

---

#### ❌ "Error: la autentificación password falló para el usuario"

**Causa**: Las credenciales en `.env` no coinciden con las de Docker.

**Solución**:
```bash
# 1. Verificar que tu .env tenga:
#    DB_PORT=5433 (no 5432)
#    DB_PASSWORD=biosstel123

# 2. Si cambiaste las credenciales, resetear la BD
pnpm db:reset
pnpm db:start
pnpm db:seed
```

---

#### ❌ "Port 5433 is already allocated"

**Causa**: Ya hay un PostgreSQL corriendo en ese puerto.

**Solución**:
```bash
# Opción 1: Detener el servicio existente
pnpm db:stop

# Opción 2: Cambiar el puerto en docker-compose.dev.yml
# Editar: "5434:5432" en vez de "5433:5432"
# Actualizar DB_PORT en .env
```

---

#### ❌ Live Reload no funciona en el backend

**Causa**: TypeScript está usando archivos compilados en vez de source.

**Solución**:
```bash
# Verificar que apps/api-biosstel/tsconfig.dev.json apunte a source files
# Debería tener paths como:
# "@biosstel/api-users": ["../../libs/backend/api-users/src/index.ts"]
# NO:
# "@biosstel/api-users": ["../../dist/libs/backend/api-users/index.js"]

# Reiniciar el servidor
# Ctrl+C y volver a ejecutar:
pnpm dev:api
```

---

#### ❌ "No hay alertas disponibles" en el dashboard

**Causa**: La base de datos no tiene datos de prueba.

**Solución**:
```bash
# Ejecutar seed
pnpm db:seed

# Si ya ejecutaste seed antes, resetear y volver a poblar
pnpm db:reset
pnpm db:start
pnpm db:seed
```

---

#### ❌ Frontend no se conecta al API (CORS error)

**Causa**: Configuración de CORS incorrecta.

**Solución**:
```bash
# Verificar que tu .env tenga:
CORS_ORIGIN=http://localhost:3000

# Reiniciar el API
# Ctrl+C en la terminal del API y:
pnpm dev:api
```

---

#### ❌ "Cannot execute operation on 'default' connection"

**Causa**: TypeORM no puede conectarse a la base de datos.

**Solución**:
```bash
# 1. Verificar que Docker esté corriendo
docker ps | grep postgres

# 2. Verificar variables de entorno
cat .env | grep DB_

# 3. Verificar conectividad
docker exec biosstel-postgres-dev psql -U biosstel -d biosstel -c "SELECT 1;"
# Debería devolver: 1
```

---

#### ❌ Build falla con "Cannot find module"

**Causa**: Intentas compilar sin tener las dependencias compiladas.

**Solución**:
```bash
# Nx compila las dependencias automáticamente
pnpm build

# Si quieres compilar solo una librería:
nx build api-users
nx build api-dashboard
```

---

### 🆘 Último Recurso: Reset Completo

Si nada funciona, prueba esto:

```bash
# 1. Detener todo
# Ctrl+C en todas las terminales

# 2. Limpiar completamente
pnpm db:stop
rm -rf node_modules
rm -rf .next
rm -rf dist
rm pnpm-lock.yaml

# 3. Reinstalar desde cero
pnpm install

# 4. Resetear base de datos
pnpm db:reset
pnpm db:start
pnpm db:seed

# 5. Reiniciar servicios
pnpm start:all
```

---

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

---

## 📖 Resumen Visual

### 🎯 Flujo de Desarrollo Típico

```
┌─────────────────────────────────────────────────────────────────┐
│  1️⃣ Primera vez configurando el proyecto                        │
└─────────────────────────────────────────────────────────────────┘
   ↓
   git clone <repo>
   cd babooni
   pnpm install
   ↓
   Crear .env con credenciales
   ↓
   pnpm db:start       # Inicia PostgreSQL en Docker
   pnpm db:seed        # Crea usuarios y datos de prueba
   ↓
   pnpm start:all      # Inicia Frontend + API
   ↓
   ✅ http://localhost:3000 (Frontend)
   ✅ http://localhost:4000/api (API)

┌─────────────────────────────────────────────────────────────────┐
│  2️⃣ Desarrollo día a día                                         │
└─────────────────────────────────────────────────────────────────┘
   ↓
   pnpm db:start       # Si no está corriendo
   pnpm start:all      # Inicia todo
   ↓
   Desarrollar...
   - Editas libs/frontend/*/src/** → Hot reload en browser
   - Editas libs/backend/*/src/**  → Nodemon reinicia API
   ↓
   Commit y push
   ↓
   CI/CD se ejecuta automáticamente:
   - Lint
   - TypeCheck
   - Tests
   - Build

┌─────────────────────────────────────────────────────────────────┐
│  3️⃣ Si algo no funciona                                          │
└─────────────────────────────────────────────────────────────────┘
   ↓
   Ver sección 🔧 Troubleshooting arriba
   ↓
   Si nada funciona: Reset completo
   - pnpm db:stop
   - rm -rf node_modules
   - pnpm install
   - pnpm db:reset && pnpm db:start
   - pnpm db:seed
   - pnpm start:all
```

### 🏗️ Arquitectura Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│                      http://localhost:3000                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages         Components        Data Access        Layouts     │
│  ------        ----------        -----------        -------     │
│  /login   →    LoginForm    →    useLogin()   →    AuthLayout  │
│  /home    →    Dashboard    →    useDashboard() →  MainLayout  │
│                     ↓                ↓                           │
│              @biosstel/ui    @biosstel/platform                 │
│              @biosstel/ui-layout                                │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP (fetch)
┌─────────────────────────────────────────────────────────────────┐
│                      API REST (NestJS)                           │
│                   http://localhost:4000/api                      │
├─────────────────────────────────────────────────────────────────┤
│  Controllers         Services          Repositories             │
│  -----------         --------          ------------             │
│  UsersController → UsersService → TypeOrmUserRepository         │
│  DashboardCtrl   → DashboardSvc → TypeOrmDashboardRepo          │
│                         ↓                                        │
│                   TypeORM Entities                              │
│              (UserEntity, DashboardEntity, etc.)                │
└─────────────────────────────────────────────────────────────────┘
                              ↕ SQL
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL (Docker)                            │
│                   localhost:5433                                 │
├─────────────────────────────────────────────────────────────────┤
│  Tables: users, dashboard_objectives, dashboard_alerts, etc.   │
│  Seed data: 3 users, 4 objectives, 7 alerts                    │
└─────────────────────────────────────────────────────────────────┘
```

### 📦 Estructura de Carpetas Simplificada

```
babooni/
│
├── apps/                              # Aplicaciones ejecutables
│   ├── front-biosstel/               # Next.js 16 (puerto 3000)
│   │   ├── src/app/[locale]/        # App Router con i18n
│   │   ├── messages/                 # Traducciones (es, en)
│   │   └── public/                   # Assets estáticos
│   │
│   └── api-biosstel/                 # NestJS (puerto 4000)
│       ├── src/                      # Código fuente
│       ├── dev.ts                    # Entry point desarrollo
│       ├── seed.ts                   # 🌱 Script de seed
│       ├── tsconfig.dev.json         # TS config para dev
│       └── tsconfig.build.json       # TS config para build
│
├── libs/                              # Librerías compartidas
│   ├── frontend/                     # Librerías de frontend
│   │   ├── auth/                     # Feature: Autenticación
│   │   ├── dashboard/                # Feature: Dashboard
│   │   ├── users/                    # Feature: Usuarios
│   │   ├── ui/                       # Componentes UI base
│   │   ├── ui-layout/                # Layouts
│   │   ├── platform/                 # Utilidades
│   │   └── shared/                   # Compartido frontend
│   │
│   ├── backend/                      # Librerías de backend
│   │   ├── api-users/                # Feature: Users API
│   │   ├── api-dashboard/            # Feature: Dashboard API
│   │   └── api-shared/               # Compartido backend
│   │
│   └── shared/                       # Compartido frontend+backend
│       └── src/index.ts              # 🔗 Tipos TypeScript
│
├── docker/                            # Configuración Docker
├── .env                              # 🔑 Variables de entorno
├── docker-compose.dev.yml            # 🐳 Docker para desarrollo
├── package.json                      # 📦 Scripts y dependencias
├── tsconfig.base.json                # ⚙️ TS config base
└── README.md                         # 📖 Este archivo
```

---

## ✨ Características Destacadas

| Característica | Descripción |
|----------------|-------------|
| 🏗️ **Arquitectura Modular** | Features extraíbles, librerías reutilizables |
| 🔥 **Live Reload Completo** | Backend + Frontend con hot reload |
| 🎯 **Type Safety** | Tipos compartidos entre frontend y backend |
| 🧪 **Testing Integrado** | Vitest + Playwright configurados |
| 🐳 **Docker Ready** | Base de datos en contenedor |
| 🔐 **Auth JWT** | Autenticación con Passport + JWT |
| 🌐 **i18n** | Soporte multiidioma (ES, EN) |
| 📊 **Dashboard** | Objetivos, alertas y asignaciones |
| 🚀 **CI/CD** | GitHub Actions configurado |
| 📖 **API Docs** | Swagger UI automático |

---
