/**
 * Store global de la aplicación (composition root).
 *
 * El shell es el único dueño de este store: aquí se combinan todos los reducers
 * de las features y las APIs compartidas (RTK Query). Las features no crean su
 * propio store; exportan un reducer y el shell lo registra bajo una clave.
 *
 * Sentido de existir:
 * - Una única fuente de verdad para el estado de la app.
 * - Las features permanecen desacopladas (cada una define su slice) pero el
 *   estado vive en un solo árbol: state.auth, state.users, state.dashboard, etc.
 * - Cualquier componente puede dispatch(thunk) o useSelector(state => state.xxx)
 *   sin conocer la implementación de cada feature.
 *
 * Cómo se integra con las features:
 * - Cada feature lib (ej. @biosstel/auth, @biosstel/usuarios) exporta un reducer
 *   (y sus thunks/acciones) desde su data-access.
 * - Este archivo importa esos reducers y los asigna a claves del objeto reducer.
 * - La clave (ej. 'auth', 'users') es el path en el estado: state.auth, state.users.
 *
 * @see ./README.md
 * @see docs/REDUX_PATTERN.md
 */

import { configureStore } from '@reduxjs/toolkit';
import { adminApi } from './api/users';

// Features: cada una exporta su reducer desde data-access
import { authReducer } from '@biosstel/auth';
import { userReducer } from '@biosstel/usuarios';
import { dashboardReducer } from '@biosstel/objetivos';
import { fichajesReducer } from '@biosstel/fichajes';
import { alertasReducer } from '@biosstel/alertas';
import { empresaReducer } from '@biosstel/empresa';
import { operacionesReducer } from '@biosstel/operaciones';
import { reportsReducer } from '@biosstel/reports';
import { inventoryReducer } from '@biosstel/inventory';
import { productosReducer } from '@biosstel/productos';

/** Claves del estado global. Usar estas constantes evita strings mágicos al hacer useSelector. */
export const STORE_KEYS = {
  auth: 'auth',
  users: 'users',
  dashboard: 'dashboard',
  fichajes: 'fichajes',
  alertas: 'alertas',
  empresa: 'empresa',
  operaciones: 'operaciones',
  reports: 'reports',
  inventory: 'inventory',
  productos: 'productos',
  adminApi: 'adminApi',
} as const;

const rootReducer = {
  [STORE_KEYS.auth]: authReducer,
  [STORE_KEYS.users]: userReducer,
  [STORE_KEYS.dashboard]: dashboardReducer,
  [STORE_KEYS.fichajes]: fichajesReducer,
  [STORE_KEYS.alertas]: alertasReducer,
  [STORE_KEYS.empresa]: empresaReducer,
  [STORE_KEYS.operaciones]: operacionesReducer,
  [STORE_KEYS.reports]: reportsReducer,
  [STORE_KEYS.inventory]: inventoryReducer,
  [STORE_KEYS.productos]: productosReducer,
  [adminApi.reducerPath]: adminApi.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
