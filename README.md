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

### Estructura

```
biosstel-monorepo/
├── apps/
│   ├── front-biosstel/     # Next.js (Frontend)
│   └── api-biosstel/       # NestJS (REST API)
├── libs/
│   └── shared-types/       # Tipos TypeScript compartidos
└── docker/                 # Docker
```

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar base de datos
npm run db:start

# 4. Iniciar desarrollo
npm start
```

## 📋 Comandos

### Desarrollo

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia todo (frontend + API) |
| `npm start:front` | Solo frontend (:3000) |
| `npm start:api` | Solo API (:4000) |
| `npm run build` | Build de todo |

### Base de Datos

| Comando | Descripción |
|---------|-------------|
| `npm run db:start` | Inicia PostgreSQL |
| `npm run db:stop` | Detiene PostgreSQL |
| `npm run db:reset` | Reinicia la BD |

## 🔌 API REST

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrarse |
| GET | /api/auth/profile | Perfil (auth) |
| GET | /api/users | Listar usuarios (auth) |
| GET | /api/health | Estado de la API |

### Documentación

Swagger disponible en: http://localhost:4000/api/docs

## 🐳 Docker

```bash
# Desarrollo: solo base de datos
npm run db:start

# Producción: todo en contenedores
npm run docker:build
npm run docker:up
```

### Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend | 3000 |
| API | 4000 |
| API Docs | 4000/api/docs |
| PostgreSQL | 5432 |
| Adminer | 8080 |

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

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=biosstel
DB_PASSWORD=biosstel123
DB_NAME=biosstel

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# App
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🤝 Contribuir

```bash
# Clonar
git clone <repo>

# Instalar
npm install

# Base de datos
npm run db:start

# Desarrollo
npm start
```

## 📄 Licencia

ISC
