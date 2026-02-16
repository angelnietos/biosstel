# Biosstel Monorepo

Monorepo para el proyecto Biosstel gestionado con [Nx](https://nx.dev).

## 📁 Estructura del Proyecto

```
biosstel-monorepo/
├── apps/
│   ├── front-biosstel/     # Aplicación Next.js (Frontend)
│   └── api-biosstel/       # API GraphQL con microservicios (Backend)
├── libs/
│   └── shared-types/       # Tipos TypeScript compartidos
├── docker/
│   ├── frontend.Dockerfile # Dockerfile para el frontend
│   ├── api.Dockerfile      # Dockerfile para la API
│   └── init-db.sql         # Script de inicialización de BD
├── docker-compose.yml      # Producción
├── docker-compose.dev.yml  # Desarrollo
├── nx.json                 # Configuración de Nx
├── package.json            # Dependencias raíz
└── tsconfig.base.json      # Configuración TypeScript base
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 20.0.0
- Docker y Docker Compose
- npm >= 10.0.0

### Instalación

```bash
npm install
```

### Variables de Entorno

```bash
cp .env.example .env
# Edita .env con tus valores
```

## 🐳 Docker

### Desarrollo (Recomendado)

Inicia solo la base de datos y ejecuta las apps localmente:

```bash
# Iniciar base de datos PostgreSQL
npm run docker:dev

# Ejecutar en otro terminal
npm run dev

# Detener base de datos
npm run docker:dev:down
```

### Producción

Construye y ejecuta todos los servicios:

```bash
# Construir e iniciar todos los servicios
npm run docker:prod

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:prod:down
```

### Servicios Disponibles

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| API GraphQL | 4000 | http://localhost:4000 |
| PostgreSQL | 5432 | localhost:5432 |
| Adminer (DB Admin) | 8080 | http://localhost:8080 |

## 📦 Desarrollo Local

### Sin Docker

```bash
# Iniciar todos los servicios en paralelo
npm run dev

# Iniciar solo el frontend
npm run dev:front

# Iniciar solo la API
npm run dev:api
```

### Build

```bash
# Build de todos los proyectos
npm run build

# Build de un proyecto específico
npm run nx build front-biosstel
npm run nx build api-biosstel
```

### Linting

```bash
npm run lint
```

## 📦 Aplicaciones

### Frontend (front-biosstel)

Aplicación Next.js 16 con:
- React 19
- Tailwind CSS 4
- next-intl para internacionalización
- Redux Toolkit para estado global
- Formik + Yup para formularios

```bash
npm run dev:front    # Desarrollo en http://localhost:3000
npm run nx build front-biosstel
```

### API (api-biosstel)

API GraphQL con arquitectura de microservicios:
- Apollo Server 5
- Express 5
- PostgreSQL con Sequelize
- Microservicio de autenticación

```bash
npm run dev:api      # Desarrollo en http://localhost:4000
npm run nx build api-biosstel
```

## 📚 Librerías Compartidas

### @biosstel/shared-types

Tipos TypeScript compartidos entre frontend y backend.

```typescript
import { User, ApiResponse, ErrorCodes } from '@biosstel/shared-types';
```

## 🔧 Comandos Nx Útiles

```bash
# Ver grafo de dependencias
npm run nx graph

# Ver proyectos afectados por cambios
npm run nx affected -t build

# Ejecutar comando en proyecto específico
npm run nx run <project>:<target>
```

## 🗄️ Base de Datos

### Conexión

```
Host: localhost
Port: 5432
Database: biosstel
User: biosstel
Password: biosstel123
```

### Adminer

Interfaz web para administrar la base de datos:
- URL: http://localhost:8080
- Sistema: PostgreSQL
- Servidor: postgres
- Usuario: biosstel
- Contraseña: biosstel123
- Base de datos: biosstel

### Resetear Base de Datos

```bash
npm run db:reset
```

## 🏗️ Agregar Nuevos Proyectos

```bash
# Nueva app Next.js
npm run nx g @nx/next:app <nombre>

# Nueva app Node.js
npm run nx g @nx/node:app <nombre>

# Nueva librería
npm run nx g @nx/js:lib <nombre>
```

## 📝 Convenciones

- **Apps**: Aplicaciones desplegables en `apps/`
- **Libs**: Código compartido en `libs/`
- **Tags**: Usar tags en `project.json` para organizar proyectos
  - `type:app` / `type:lib`
  - `scope:frontend` / `scope:backend` / `scope:shared`
  - `framework:nextjs` / `framework:node`

## 🔐 Variables de Entorno

Ver [`.env.example`](.env.example) para todas las variables disponibles.

### Variables Requeridas

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL |
| `JWT_SECRET` | Secreto para tokens JWT |
| `NEXT_PUBLIC_API_URL` | URL de la API para el frontend |

## 📖 Documentación Adicional

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contribuir

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Iniciar base de datos: `npm run docker:dev`
4. Copiar variables de entorno: `cp .env.example .env`
5. Iniciar desarrollo: `npm run dev`

## 📄 Licencia

ISC
