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
├── docker/                 # Archivos Docker
├── docker-compose.yml      # Producción completa
└── docker-compose.dev.yml  # Solo base de datos
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus valores
```

### 3. Iniciar la base de datos

```bash
npm run db:start
```

### 4. Iniciar las aplicaciones

```bash
npm start
```

¡Eso es todo! Ahora tienes:
- Frontend: http://localhost:3000
- API: http://localhost:4000
- Adminer (admin BD): http://localhost:8080

## 📋 Comandos Principales

### Desarrollo Diario

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia frontend + API en paralelo |
| `npm start:front` | Inicia solo el frontend |
| `npm start:api` | Inicia solo la API |
| `npm run build` | Construye todos los proyectos |
| `npm run lint` | Ejecuta linter en todos los proyectos |

### Base de Datos

| Comando | Descripción |
|---------|-------------|
| `npm run db:start` | Inicia PostgreSQL + Adminer |
| `npm run db:stop` | Detiene la base de datos |
| `npm run db:reset` | Reinicia la base de datos (borra datos) |
| `npm run db:logs` | Ver logs de la base de datos |

### Docker (Producción)

| Comando | Descripción |
|---------|-------------|
| `npm run docker:build` | Construye imágenes Docker |
| `npm run docker:up` | Inicia todos los servicios |
| `npm run docker:down` | Detiene todos los servicios |
| `npm run docker:logs` | Ver logs de todos los servicios |

## 🐳 ¿Por qué Docker?

### Sin Docker (Desarrollo Local)
- Usas tu Node.js local
- Ejecutas `npm start` directamente
- La base de datos corre en Docker (PostgreSQL)

### Con Docker (Producción)
- Todos los servicios en contenedores
- Mismo entorno en desarrollo y producción
- Fácil despliegue

## 🗄️ Base de Datos

### Conexión

```
Host: localhost
Port: 5432
Database: biosstel
User: biosstel
Password: biosstel123
```

### Adminer (UI para BD)

1. Abre http://localhost:8080
2. Selecciona "PostgreSQL"
3. Usa las credenciales de arriba

## 📦 Aplicaciones

### Frontend (front-biosstel)

- Next.js 16 + React 19
- Tailwind CSS 4
- next-intl (internacionalización)
- Redux Toolkit

```bash
npm start:front    # http://localhost:3000
```

### API (api-biosstel)

- Apollo Server 5 (GraphQL)
- Express 5
- PostgreSQL + Sequelize
- Microservicio de autenticación

```bash
npm start:api    # http://localhost:4000
```

## 🔧 Comandos Nx

```bash
# Ver grafo de dependencias
npm run nx graph

# Ver proyectos
npm run nx show projects

# Ejecutar tarea específica
npm run nx build front-biosstel
```

## 🔐 Variables de Entorno

Ver [`.env.example`](.env.example) para todas las variables.

### Mínimas para desarrollo

```env
DATABASE_URL=postgresql://biosstel:biosstel123@localhost:5432/biosstel
JWT_SECRET=tu-secreto-jwt
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🤝 Flujo de Trabajo del Equipo

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd biosstel-monorepo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar entorno**
   ```bash
   cp .env.example .env
   # Editar .env
   ```

4. **Iniciar base de datos**
   ```bash
   npm run db:start
   ```

5. **Desarrollar**
   ```bash
   npm start
   ```

## 📄 Licencia

ISC
