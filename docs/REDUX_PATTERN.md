# Patrón Redux en las features (acciones + efectos)

En Redux (con Redux Toolkit) cada feature que usa datos del servidor debería seguir este patrón:

## 1. Estado (State)

- Interfaz tipada del estado del slice.
- `initialState` con valores por defecto.

## 2. Acciones síncronas (reducers)

- Cambios de estado que no llaman al API: `clearError`, `setLoading`, `reset`, etc.
- Se definen en `reducers: { ... }` del `createSlice`.
- Se exportan con `slice.actions`.

## 3. Efectos asíncronos (thunks)

- Llamadas al API que disparan varias acciones: **pending** → **fulfilled** o **rejected**.
- Se definen con `createAsyncThunk('feature/accion', async (arg) => api.xxx(arg))`.
- El componente hace `dispatch(fetchAlgo())`; el slice no hace dispatch manual, solo define el thunk.

## 4. Manejo de los efectos (extraReducers)

- Con `extraReducers(builder)` se reacciona a las acciones que generan los thunks:
  - `thunk.pending` → p. ej. `state.isLoading = true; state.error = null`
  - `thunk.fulfilled` → `state.data = action.payload; state.isLoading = false`
  - `thunk.rejected` → `state.error = action.error.message; state.isLoading = false`

## 5. Exportaciones del slice

- `default`: el reducer (`slice.reducer`).
- Acciones síncronas: `export const { clearError, ... } = slice.actions`.
- Thunks: exportar cada `createAsyncThunk` para que los componentes/pages hagan `dispatch(fetchX())`.

## Referencia en el repo

- **fichajes**: varios thunks (fetchFichajes, clockIn, fetchTasks, etc.) + extraReducers.
- **Solo acciones síncronas** (el “efecto” está fuera): `auth` (login en componente, luego `setCredentials`), `usuarios` (useUsers hace getUsers y dispatch(setUsers)).
- **Slices vacíos** (sin acciones ni efectos): antes `empresa`, `alertas`, `operaciones`; se van alineando a este patrón.

## Resumen

| Qué                | Dónde                         |
|--------------------|-------------------------------|
| Estado             | `initialState` + interfaz     |
| Acciones síncronas | `reducers` en createSlice     |
| Efectos (async)    | `createAsyncThunk`            |
| Reacción a efectos | `extraReducers` (pending/fulfilled/rejected) |

Así las acciones y los efectos viven en el slice y cualquier componente puede hacer `dispatch(fetchEmpresa())` o `useSelector(state => state.empresa)` sin duplicar lógica de carga.
