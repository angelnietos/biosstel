# Boundaries, ESLint y tipos compartidos

Guía para el equipo: reglas de dependencias entre libs (Nx), configuración ESLint y uso de tipos entre frontend y backend.

---

## 1. Resumen rápido

| Tema | Dónde | Qué hace |
|------|--------|----------|
| **Boundaries** | `project.json` (tags) + `eslint.config.mjs` (depConstraints) | Define qué lib puede importar de cuál. Si tu proyecto no tiene un tag que coincida con alguna restricción, no puede depender de ninguna lib. |
| **ESLint** | `eslint.config.mjs` | Aplica boundaries y reglas TypeScript (no-explicit-any, consistent-type-imports, etc.). |
| **Tipos compartidos** | `libs/shared-types` | Única fuente de verdad para tipos usados por frontend y backend. Las features re-exportan lo que necesitan en su carpeta `types/`. |

---

## 2. Tags Nx y qué proyecto los usa

Cada lib/app tiene **tags** en su `project.json`. Esos tags son los que usa la regla `@nx/enforce-module-boundaries` para decidir si un `import` está permitido.

### 2.1 Tabla de proyectos y tags

| Proyecto | Ruta | Tags |
|----------|------|------|
| **App frontend** | `apps/front-biosstel` | `type:app`, `framework:nextjs`, `scope:frontend` |
| **App API** | `apps/api-biosstel` | `type:api`, `framework:nestjs`, `scope:api` |
| **shell** | `libs/frontend/shell` | `type:shell`, `scope:frontend` |
| **shared** | `libs/frontend/shared` | `scope:shared` |
| **platform** | `libs/frontend/platform` | `type:platform`, `scope:platform` |
| **ui** | `libs/frontend/ui` | `type:ui`, `scope:ui` |
| **ui-layout** | `libs/frontend/ui-layout` | `type:layout`, `scope:layout` |
| **shared-types** | `libs/shared-types` | `type:shared-types`, `npm:private` |
| **Features frontend** | `libs/frontend/features/*` | `type:feature` + `scope:{nombre}` (ej. `scope:objetivos`, `scope:auth`) |
| **Libs API** | `libs/backend/api-*` | `type:feature`, `scope:api`, `scope:api-{nombre}` |
| **api-shared** | `libs/backend/api-shared` | `scope:api`, `type:shared-types` |

### 2.2 Cómo se leen los tags

- **sourceTag:** “Si tu proyecto tiene **este** tag, se te aplica esta restricción.”
- **onlyDependOnLibsWithTags:** “Solo puedes importar proyectos (libs) que tengan **al menos uno** de estos tags.”

Si un proyecto **no tiene ningún tag** que coincida con un `sourceTag` de `depConstraints`, Nx lo trata como “sin restricción” y **no le permite depender de ninguna lib** (error: *“A project without tags matching at least one constraint cannot depend on any libraries”*).

---

## 3. Restricciones de dependencias (depConstraints)

Definidas en `eslint.config.mjs` → `@nx/enforce-module-boundaries` → `depConstraints`.

### 3.1 Grafo permitido (frontend)

```
                    type:app (front-biosstel)
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
  type:feature          type:shell            scope:shared
  (objetivos, etc.)     (store, api)          (shared)
         │                    │                    │
         │    ┌───────────────┼────────────────────┘
         │    │               │
         ▼    ▼               ▼
  type:ui, type:layout   type:platform   type:shared-types
```

### 3.2 Tabla: quién puede depender de quién

| Quien importa (sourceTag) | Solo puede importar libs con estos tags |
|---------------------------|------------------------------------------|
| `type:app` | `type:feature`, `type:ui`, `type:layout`, `type:platform`, `type:shell`, `scope:shared`, `type:shared-types` |
| `type:shell` | `scope:shared`, `type:platform`, `type:shared-types` |
| `type:feature` | `type:ui`, `type:layout`, `type:platform`, `scope:shared`, `type:feature`, `type:shared-types` |
| `type:ui` | `type:ui` (solo a sí misma) |
| `type:layout` | `type:ui`, `type:layout` |
| `scope:shared` | `type:ui`, `type:layout`, `scope:shared`, `type:platform` |
| `type:platform` | `type:platform` |
| `scope:api` | `scope:api`, `type:shared-types` |
| `type:shared-types` | `type:shared-types` |

### 3.3 Reglas prácticas

- **ui:** No importa de shared, platform ni features. Solo React y dependencias de estilo.
- **layout:** Solo ui y layout.
- **shared:** No importa de features. Sí de ui, ui-layout, platform.
- **features:** No importan de otras features (salvo excepciones documentadas en [FRONTEND_BOUNDARIES.md](../plans/FRONTEND_BOUNDARIES.md)).
- **shell:** Solo shared, platform y shared-types (store, RTK Query, etc.).
- **app:** Ensambla features, shell y shared.

---

## 4. Añadir una nueva lib o corregir el error de boundaries

### 4.1 Error: “A project without tags matching at least one constraint cannot depend on any libraries”

**Causa:** El proyecto que importa tiene tags que no coinciden con ningún `sourceTag` en `depConstraints`.

**Pasos:**

1. Abre `libs/.../project.json` del proyecto que falla y revisa su `tags`.
2. En `eslint.config.mjs`, en `depConstraints`:
   - Si ese proyecto **debería** tener una regla nueva: añade un objeto con su `sourceTag` y el `onlyDependOnLibsWithTags` que corresponda.
   - Si el proyecto debería comportarse como uno existente, asígnale en `project.json` un tag que ya tenga restricción (por ejemplo `type:feature`).

**Ejemplo:** La lib `shell` tenía `type:shell` y no había restricción para ese tag. Se añadió:

```javascript
{
  sourceTag: 'type:shell',
  onlyDependOnLibsWithTags: ['scope:shared', 'type:platform', 'type:shared-types'],
}
```

y en la app se permitió depender de `type:shell` añadiendo `'type:shell'` a la lista de la restricción de `type:app`.

### 4.2 Añadir una nueva lib al monorepo

1. Crear el proyecto (Nx generator o a mano) y su `project.json`.
2. Asignar **tags** que existan en `depConstraints` (o añadir una nueva restricción para un tag nuevo).
3. Si la nueva lib debe ser importable por otros, asegurarse de que esos “otros” tengan en su `onlyDependOnLibsWithTags` un tag que tenga la nueva lib.

Comprobar con:

```bash
pnpm exec nx run <proyecto>:lint
```

---

## 5. Reglas ESLint relevantes

Configuración en `eslint.config.mjs` (archivos `**/*.ts`, `**/*.tsx`):

| Regla | Nivel | Descripción |
|-------|--------|-------------|
| `@nx/enforce-module-boundaries` | error | Dependencias entre proyectos según tags (ver sección anterior). |
| `@typescript-eslint/no-unused-vars` | warn | Variables/parámetros no usados (args que empiezan por `_` se ignoran). |
| `@typescript-eslint/no-explicit-any` | warn | Evitar `any`; usar tipos concretos o `unknown`. |
| `@typescript-eslint/consistent-type-imports` | warn | Usar `import type { X }` para tipos. |

Los proyectos pueden extender o sobreescribir en su propio `eslint.config.mjs` (por ejemplo `apps/front-biosstel/eslint.config.mjs`) si hace falta.

---

## 6. Tipos compartidos: `@biosstel/shared-types`

### 6.1 Rol

- **Una sola fuente de verdad** para tipos que usan frontend y backend (usuarios, fichajes, objetivos, empresa, productos, inventario, informes, etc.).
- Evita duplicar interfaces y que front y API se desincronicen.

### 6.2 Dónde está

- **Código:** `libs/shared-types/src/index.ts`
- **Alias:** `@biosstel/shared-types` (definido en `tsconfig.base.json`).

### 6.3 Cómo se usa en el frontend

- Las **features** no suelen importar directamente `@biosstel/shared-types` en toda la feature; en su carpeta **types** re-exportan lo que necesitan y el resto de la feature importa desde `./types` o el barrel de la feature.

**Ejemplo (objetivos):**

```ts
// libs/frontend/features/objetivos/src/types/index.ts
export type {
  DashboardObjective,
  DashboardObjectiveAccent,
  DashboardAlert,
  DashboardHomeResponse,
  TerminalObjectivesHeader,
  TerminalObjectivesResponse,
} from '@biosstel/shared-types';
```

Así las páginas y servicios de objetivos importan desde `@biosstel/objetivos` (o desde `./types`) y no repiten el path a shared-types.

### 6.4 Cómo se usa en el backend

- Las libs de la API (`libs/backend/api-*`) importan directamente de `@biosstel/shared-types` en DTOs, entidades (cuando se alinean con el contrato), controladores y casos de uso.

**Ejemplo:**

```ts
import type { User, CreateUserData, PaginatedResult } from '@biosstel/shared-types';
```

- Los **controladores** devuelven objetos que cumplen interfaces de shared-types (por ejemplo `User`, `PaginatedResult<User>`, `Fichaje`, etc.) para que el contrato sea el mismo que consume el front.

---

## 7. Cómo añadir nuevos tipos

### 7.1 Tipos que afectan a frontend y backend (API, DTOs, respuestas)

1. **Añadirlos en** `libs/shared-types/src/index.ts`:
   - Interfaces o types (por ejemplo `NewEntity`, `NewEntityResponse`, `CreateNewEntityData`).
2. **Backend:** Importar desde `@biosstel/shared-types` en handlers, DTOs y controladores; usar esos tipos en respuestas y en bodies validados.
3. **Frontend:** En la feature que corresponda, re-exportar en `types/index.ts`:
   ```ts
   export type { NewEntity, NewEntityResponse } from '@biosstel/shared-types';
   ```
   Y usar esos tipos en servicios y componentes de esa feature.

No duplicar la definición en front y back; solo en shared-types y re-export donde haga falta.

### 7.2 Tipos solo de frontend (UI o estado local de una feature)

- Pueden vivir **solo en la feature**, en su carpeta `types/`:
  - Definir en `types/index.ts` o en un fichero bajo `types/` y exportar en `types/index.ts`.
- No es obligatorio meterlos en shared-types si el backend no los usa.

### 7.3 Tipos solo de backend (entidades ORM, internos)

- Pueden estar en la propia lib backend (por ejemplo en `domain/entities` o en DTOs internos).
- Si más adelante el frontend necesita ese contrato, mover la interfaz pública a shared-types y que el backend importe desde ahí.

### 7.4 Resumen

| Tipo de tipo | Dónde definirlo | Frontend | Backend |
|--------------|------------------|----------|---------|
| Contrato API / DTO compartido | `libs/shared-types` | Re-export en feature `types/` y usar | Import de `@biosstel/shared-types` |
| Solo UI / estado local de una feature | `libs/frontend/features/<name>/src/types/` | Usar en la feature | No |
| Solo interno backend | En la lib api-* (entities, DTOs internos) | No | Usar en esa lib |

---

## 8. Integración frontend–backend con tipos

### 8.1 Flujo recomendado

1. **Contrato en shared-types:** Respuestas (por ejemplo `DashboardHomeResponse`), DTOs de creación/actualización, filtros comunes.
2. **Backend:** Controladores y handlers devuelven/reciben objetos que cumplen esas interfaces (o clases que las implementen). Validación (p. ej. class-validator) sobre DTOs alineados con shared-types.
3. **Frontend:** Servicios (fetch) tipan respuestas con los tipos de shared-types (re-exportados por la feature). Las pantallas usan esos mismos tipos.

### 8.2 Añadir un nuevo endpoint o recurso

1. Definir en `libs/shared-types`:
   - Tipo del recurso (ej. `NewResource`).
   - Si aplica: `CreateNewResourceData`, `UpdateNewResourceData`, `NewResourceListResponse` o `PaginatedResult<NewResource>`.
2. Backend: implementar endpoint; request/response tipados con esos tipos.
3. Frontend: en la feature correspondiente, re-exportar en `types/` y usar en el servicio que llama al endpoint y en los componentes.

---

## 9. Referencias

- **Boundaries y capas frontend:** [plans/FRONTEND_BOUNDARIES.md](../plans/FRONTEND_BOUNDARIES.md)
- **Estructura de features:** [libs/frontend/features/README.md](../libs/frontend/features/README.md)
- **Configuración ESLint:** raíz del repo, `eslint.config.mjs`
- **Tags por proyecto:** `libs/*/project.json` y `apps/*/project.json`
