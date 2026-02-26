# Store global (shell)

Este directorio contiene el **store de Redux** de la aplicación y su integración con las features.

## Por qué existe el store global

- **Una sola fuente de verdad**: todo el estado de la app vive en un único árbol (`state.auth`, `state.users`, `state.dashboard`, etc.).
- **Composición en un solo sitio**: el **shell** es el único que crea y configura el store. Las features no instancian su propio store; exportan un **reducer** (y sus thunks/acciones) y el shell los registra.
- **Desacoplamiento de features**: cada feature define su slice (estado + reducers + thunks) en su lib; el shell solo los combina. Así se evita que la app dependa de detalles internos de cada feature.

## Quién es dueño

- **Shell** (`libs/frontend/shell`) es el dueño del store.
- Las **features** (`libs/frontend/features/*`) solo exportan:
  - `reducer` (el default del slice),
  - thunks (ej. `fetchUsers`, `patchTerminalObjectiveThunk`),
  - acciones síncronas (ej. `clearError`),
  - tipos (ej. `UserState`).

## Cómo se integra con las features

| Clave en el store | Feature (lib)        | Descripción breve                |
|-------------------|------------------------|----------------------------------|
| `auth`            | `@biosstel/auth`       | Login, sesión, forgotPassword    |
| `users`           | `@biosstel/usuarios`   | Lista usuarios, crear, detalle, documentos |
| `dashboard`       | `@biosstel/objetivos`  | Dashboard home, objetivos terminales, patch |
| `fichajes`        | `@biosstel/fichajes`   | Control jornada, tareas, fichajes |
| `alertas`         | `@biosstel/alertas`    | Alertas (tracking, recordatorios, ventas) |
| `empresa`         | `@biosstel/empresa`    | Empresa, centros de trabajo, cuentas |
| `operaciones`     | `@biosstel/operaciones`| Listado de operaciones           |
| `reports`         | `@biosstel/reports`    | Resumen de reportes              |
| `inventory`       | `@biosstel/inventory`  | Inventario, ítems, actualización |
| `productos`       | `@biosstel/productos`  | Productos, CRUD                  |
| `adminApi`        | Shell (store/api)      | RTK Query: login/admin, users (legacy) |

Las claves se definen en `store.ts` como `STORE_KEYS` para usarlas en `useSelector(state => state[STORE_KEYS.xxx])` y evitar strings sueltos.

## Estructura del directorio

```
store/
├── README.md          # Este archivo
├── store.ts           # configureStore, rootReducer, RootState, AppDispatch, STORE_KEYS
├── index.ts           # Re-export público del store (store, tipos, hooks, api)
├── hooks.ts           # useAppDispatch, useAppSelector (tipados con RootState/AppDispatch)
└── api/
    └── users.ts       # adminApi (RTK Query): login, getUsers, addUser
```

## Cómo añadir una nueva feature al store

1. En la feature, crear un slice en `data-access/store` (ej. `miFeatureSlice.ts`) con `createSlice` y opcionalmente `createAsyncThunk`.
2. Exportar el reducer por defecto y los thunks/acciones desde `data-access/store/index.ts` (y desde el `index` de la lib si hace falta).
3. En **shell**: en `store/store.ts`:
   - Añadir una entrada en `STORE_KEYS` (ej. `miFeature: 'miFeature'`).
   - Importar el reducer de la lib (ej. `import { miFeatureReducer } from '@biosstel/mi-feature'`).
   - Añadir `[STORE_KEYS.miFeature]: miFeatureReducer` al objeto `rootReducer`.
4. Actualizar esta tabla en el README con la nueva clave y feature.

## Uso en la app

- El store se inyecta en la app vía `Provider` (en `apps/front-biosstel` se usa el store exportado por `@biosstel/shell`).
- **Donde debes usar el store global**: en el **shell** y en la **app** (front-biosstel). Importa desde `@biosstel/shell`:
  - `useAppDispatch()` y `useAppSelector()` para dispatch y lectura tipada.
  - `STORE_KEYS` para las claves del estado: `useAppSelector(state => state[STORE_KEYS.auth])` en lugar de `state.auth` a mano.
- Las **features** no pueden depender del shell (el shell las importa), así que en las features se usa `useDispatch`/`useSelector` de `react-redux` y se tipa el estado localmente (ej. `(state: { users: UserState }) => state.users`). El estado es el mismo store global inyectado por la app.

## Patrón Redux en features

Las features siguen el patrón descrito en **`docs/REDUX_PATTERN.md`**: estado en el slice, acciones síncronas en `reducers`, efectos asíncronos con `createAsyncThunk` y reacción en `extraReducers`. Las llamadas al API viven solo en los thunks (dentro de data-access); las páginas y hooks solo hacen `dispatch(thunk)` y leen del estado.
