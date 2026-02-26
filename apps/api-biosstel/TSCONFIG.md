# 📝 Configuración de TypeScript en `api-biosstel`

Este proyecto usa **múltiples tsconfig.json** para diferentes propósitos. Aquí está la explicación de cada uno:

---

## 🗂️ **Archivos de configuración**

### 1️⃣ **`tsconfig.json`** — Base / IDE

**Propósito**: Configuración base para el IDE (VSCode, Cursor, etc.)

**Paths**: Apuntan a **source files** (`.ts`)

```json
{
  "@biosstel/api-users": ["../../libs/backend/api-users/src/index.ts"],
  "@biosstel/api-dashboard": ["../../libs/backend/api-dashboard/src/index.ts"],
  "@biosstel/shared-types": ["../../libs/shared-types/src/index.ts"]
}
```

**Por qué**:

- ✅ El IDE no muestra errores de módulos faltantes
- ✅ IntelliSense funciona correctamente
- ✅ No necesitas compilar las libs para que el editor funcione

---

### 2️⃣ **`tsconfig.dev.json`** — Desarrollo con Live Reload

**Propósito**: Usado por `ts-node` + `nodemon` para desarrollo

**Comando**: `pnpm dev:api` (ejecuta `nodemon` con este tsconfig)

**Paths**: Apuntan a **source files** (`.ts`)

```json
{
  "@biosstel/api-users": ["../../libs/backend/api-users/src/index.ts"],
  "@biosstel/api-dashboard": ["../../libs/backend/api-dashboard/src/index.ts"],
  "@biosstel/shared-types": ["../../libs/shared-types/src/index.ts"]
}
```

**Por qué**:

- ✅ **Live reload**: al editar archivos en `libs/`, nodemon reinicia el servidor automáticamente
- ✅ No necesitas `pnpm build` antes de correr el API
- ✅ Desarrollo más rápido

---

### 3️⃣ **`tsconfig.build.json`** — Build de Producción

**Propósito**: Usado por `@nx/js:tsc` para compilar el proyecto

**Comando**: `pnpm build:api` o `nx build api-biosstel`

**Paths**: Apuntan a **archivos compilados** (`.js` en `dist/`)

```json
{
  "@biosstel/api-users": ["../../dist/libs/backend/api-users/index.js"],
  "@biosstel/api-dashboard": ["../../dist/libs/backend/api-dashboard/index.js"],
  "@biosstel/shared-types": ["../../dist/libs/shared-types/index.js"]
}
```

**Por qué**:

- ✅ Usa código **precompilado** de las libs (más rápido en runtime)
- ✅ No incluye archivos `.ts` en producción
- ✅ Build optimizado para deploy

**Dependencias**: Antes de compilar `api-biosstel`, Nx compila automáticamente:

1. `@biosstel/shared-types`
2. `@biosstel/api-shared`
3. `@biosstel/api-users`
4. `@biosstel/api-dashboard`

---

### 4️⃣ **`tsconfig.app.json`** — Legacy (ya no se usa)

Este archivo existía originalmente pero **ya no se usa** activamente. Se mantiene por compatibilidad pero no afecta el build ni el desarrollo.

---

## 🎯 **Flujo de trabajo recomendado**

### **Desarrollo** (día a día)

```bash
# 1. Iniciar base de datos
pnpm db:start

# 2. Poblar datos de prueba (solo primera vez)
pnpm db:seed

# 3. Iniciar API en modo desarrollo (usa tsconfig.dev.json)
pnpm dev:api

# ✅ Ahora puedes editar archivos en libs/ y el API se reiniciará automáticamente
```

### **Build para producción**

```bash
# 1. Compilar todas las libs + API (usa tsconfig.build.json)
pnpm build

# 2. Iniciar desde archivos compilados
node dist/apps/api-biosstel/main.js
```

---

## ⚠️ **Reglas importantes**

1. **Nunca apuntes `tsconfig.json` a `dist/`** → El IDE mostrará errores si las libs no están compiladas
2. **Nunca apuntes `tsconfig.dev.json` a `dist/`** → Perderás live reload
3. **Siempre apunta `tsconfig.build.json` a `dist/`** → Producción debe usar código compilado
4. **Si agregas una nueva lib**, actualiza los 3 archivos:
   - `tsconfig.json` → `libs/backend/nueva-lib/src/index.ts`
   - `tsconfig.dev.json` → `libs/backend/nueva-lib/src/index.ts`
   - `tsconfig.build.json` → `dist/libs/backend/nueva-lib/index.js`

---

## 📊 **Resumen visual**

```
┌─────────────────────────────────────────────────────────────┐
│  Desarrollo (tsconfig.dev.json)                             │
│  ────────────────────────────────────────────────────────   │
│  Editas:                                                     │
│    libs/backend/api-users/src/users.service.ts              │
│           ↓                                                  │
│    nodemon detecta cambio                                   │
│           ↓                                                  │
│    ts-node recompila y reinicia                             │
│           ↓                                                  │
│    API corriendo con cambios                                │
│  ✅ Live reload funciona                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Producción (tsconfig.build.json)                           │
│  ────────────────────────────────────────────────────────   │
│  1. nx build api-users (compila a dist/libs/...)            │
│  2. nx build api-dashboard (compila a dist/libs/...)        │
│  3. nx build api-biosstel (usa dist/ de las libs)           │
│           ↓                                                  │
│  dist/apps/api-biosstel/main.js (listo para deploy)         │
│  ✅ Build optimizado                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **Troubleshooting**

### **Error: Cannot find module '@biosstel/...'**

- **En IDE**: Reinicia el TypeScript Language Server (Cmd/Ctrl + Shift + P → "Restart TS Server")
- **En build**: Verifica que `tsconfig.build.json` tenga los paths correctos
- **En dev**: Verifica que `tsconfig.dev.json` apunte a `libs/*/src/index.ts`

### **Live reload no funciona**

- Verifica que `tsconfig.dev.json` apunte a **source files** (no a `dist/`)
- Verifica que `nodemon` esté watching las carpetas correctas (`--watch libs/backend`)

### **Build falla con "Cannot find module"**

- Compila las dependencias primero: `pnpm build` (Nx lo hace automáticamente)
- Verifica que `tsconfig.build.json` apunte a `dist/libs/...`

---

**Última actualización**: Febrero 2026
