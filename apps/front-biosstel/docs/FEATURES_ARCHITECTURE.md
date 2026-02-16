# Arquitectura de Features - Biosstel

Esta guía documenta la arquitectura basada en features implementada en el proyecto frontend, inspirándose en la estructura de Nx/Angular para mantener consistencia y escalabilidad.

## Estructura de Carpetas

```
src/
├── features/                    # Features del dominio
│   ├── auth/                   # Feature de autenticación
│   │   ├── shell/              # Contenedor/Layout principal
│   │   │   └── AuthShell.tsx
│   │   ├── data-access/        # Lógica de datos y estado
│   │   │   ├── authApi.ts      # Funciones API
│   │   │   └── useAuth.ts      # Hook de React
│   │   ├── api/                # Rutas API de Next.js
│   │   │   └── auth/
│   │   │       └── route.ts
│   │   ├── pages/              # Componentes y páginas
│   │   │   ├── components/     # Componentes específicos
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── InputPassword.tsx
│   │   │   └── layouts/         # Layouts específicos
│   │   │       └── AuthLayout.tsx
│   │   └── index.ts            # Exports públicos
│   │
│   ├── users/                  # Feature de usuarios
│   │   ├── shell/
│   │   ├── data-access/
│   │   ├── api/
│   │   ├── pages/
│   │   └── index.ts
│   │
│   └── index.ts                # Barrel exports
│
├── components/                 # Componentes compartidos/atoms
│   ├── atoms/
│   │   ├── Input/
│   │   └── icons/
│   └── molecules/
│       └── InputPassword/
│
└── app/                        # Páginas de Next.js
    └── [locale]/
        ├── (auth)/             # Grupo de rutas auth
        │   └── login/
        │       └── page.tsx
        └── (admin)/            # Grupo de rutas admin
            └── users/
                └── page.tsx
```

## Descripción de Carpetas

### 1. Shell (`/shell`)
- **Propósito**: Contenedor principal de la feature
- **Equivalente en Angular**: Componente root del módulo
- **Contenido**: Estructura base, header, navegación
- **Uso**: Se envuelve alrededor de toda la feature

```tsx
// Ejemplo: AuthShell.tsx
export default function AuthShell({ children }) {
  return (
    <div className="auth-shell">
      <header>...</header>
      <main>{children}</main>
    </div>
  )
}
```

### 2. Data Access (`/data-access`)
- **Propósito**: Toda la lógica de datos y estado
- **Equivalente en Angular**: Servicios con Dependency Injection
- **Contenido**:
  - `*Api.ts`: Funciones para llamadas HTTP a la API
  - `use*.ts`: Hooks de React para estado y lógica

```tsx
// Ejemplo: useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null)
  
  const login = async (credentials) => {
    const response = await loginApi(credentials)
    setUser(response.user)
  }
  
  return { user, login, logout }
}
```

### 3. API (`/api`)
- **Propósito**: Rutas API de Next.js (Server-Side)
- **Equivalente en Angular**: Controladores NestJS
- **Contenido**: Handlers para GET, POST, PUT, DELETE

```tsx
// Ejemplo: api/auth/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  // Procesar y devolver respuesta
}
```

### 4. Pages (`/pages`)
- **Propósito**: Componentes de UI específicos de la feature
- **Equivalente en Angular**: Componentes del módulo
- **Subcarpetas**:
  - `components/`: Componentes de presentación
  - `layouts/`: Layouts que usan el shell

```tsx
// Ejemplo: LoginForm.tsx
export default function LoginForm() {
  const { login, isLoading } = useAuth()
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
    </form>
  )
}
```

## Cómo Crear una Nueva Feature

1. **Crear la estructura de carpetas**:
   ```bash
   mkdir -p src/features/<nombre-feature>/{shell,data-access,api,pages/{components,layouts}}
   ```

2. **Crear el Shell**:
   ```tsx
   // features/<nombre-feature>/shell/FeatureShell.tsx
   export default function FeatureShell({ children }) {
     return <div className="feature-shell">{children}</div>
   }
   ```

3. **Crear Data Access**:
   ```tsx
   // features/<nombre-feature>/data-access/featureApi.ts
   export async function getData() { ... }
   
   // features/<nombre-feature>/data-access/useFeature.ts
   export function useFeature() { ... }
   ```

4. **Crear API Routes** (opcional):
   ```tsx
   // features/<nombre-feature>/api/resource/route.ts
   export async function GET() { ... }
   ```

5. **Crear Componentes y Layouts**:
   ```tsx
   // features/<nombre-feature>/pages/components/FeatureComponent.tsx
   // features/<nombre-feature>/pages/layouts/FeatureLayout.tsx
   ```

6. **Exportar todo desde index.ts**:
   ```ts
   // features/<nombre-feature>/index.ts
   export * from './shell'
   export * from './data-access'
   export * from './pages'
   ```

7. **Agregar al índice principal**:
   ```ts
   // features/index.ts
   export * from './<nombre-feature>'
   ```

## Uso en Páginas de Next.js

```tsx
// app/[locale]/ruta/page.tsx
import { Component, Layout } from '../../../../features'

export default function Page() {
  return (
    <Layout>
      <Component />
    </Layout>
  )
}
```

## Beneficios de Esta Arquitectura

1. **Modularidad**: Cada feature es autocontenida
2. **Reutilización**: Fácil de usar en diferentes partes
3. **Escalabilidad**: Nueva feature = nueva carpeta
4. **Consistencia**: Estructura predecible
5. **Testabilidad**: Cada parte se puede probar independientemente
6. **Lazy Loading**: Se puede cargar solo lo necesario

## Notas para el Equipo

- Los **componentes compartidos** (Input, Button, etc.) van en `/components`
- Las **features** son módulos de negocio completos
- Mantener la estructura consistente en todas las features
- Usar TypeScript para tipos compartidos
- Los hooks deben manejar estados de carga y error
