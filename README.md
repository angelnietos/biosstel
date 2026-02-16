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
├── nx.json                 # Configuración de Nx
├── package.json            # Dependencias raíz
├── pnpm-workspace.yaml     # Configuración de workspaces pnpm
└── tsconfig.base.json      # Configuración TypeScript base
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Instalación

```bash
pnpm install
```

### Desarrollo

```bash
# Iniciar todos los servicios en paralelo
pnpm dev

# Iniciar solo el frontend
pnpm dev:front

# Iniciar solo la API
pnpm dev:api
```

### Build

```bash
# Build de todos los proyectos
pnpm build

# Build de un proyecto específico
pnpm nx build front-biosstel
pnpm nx build api-biosstel
```

### Linting

```bash
pnpm lint
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
pnpm dev:front    # Desarrollo en http://localhost:3000
pnpm nx build front-biosstel
```

### API (api-biosstel)

API GraphQL con arquitectura de microservicios:
- Apollo Server 5
- Express 5
- PostgreSQL con Sequelize
- Microservicio de autenticación

```bash
pnpm dev:api      # Desarrollo en http://localhost:4000
pnpm nx build api-biosstel
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
pnpm nx graph

# Ver proyectos afectados por cambios
pnpm nx affected -t build

# Ejecutar comando en proyecto específico
pnpm nx run <project>:<target>
```

## 🏗️ Agregar Nuevos Proyectos

```bash
# Nueva app Next.js
pnpm nx g @nx/next:app <nombre>

# Nueva app Node.js
pnpm nx g @nx/node:app <nombre>

# Nueva librería
pnpm nx g @nx/js:lib <nombre>
```

## 📝 Convenciones

- **Apps**: Aplicaciones desplegables en `apps/`
- **Libs**: Código compartido en `libs/`
- **Tags**: Usar tags en `project.json` para organizar proyectos
  - `type:app` / `type:lib`
  - `scope:frontend` / `scope:backend` / `scope:shared`
  - `framework:nextjs` / `framework:node`

## 🔐 Variables de Entorno

Cada aplicación tiene su propio archivo `.env.example`:

- `apps/front-biosstel/.env.local`
- `apps/api-biosstel/.env`
- `apps/api-biosstel/microservices/auth/.env`
- `apps/api-biosstel/microservices/common/.env`

## 📖 Documentación Adicional

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
