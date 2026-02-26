/**
 * Punto de entrada del store global.
 * Re-exporta store, tipos, hooks tipados y API (RTK Query) para que la app
 * y el resto del shell importen desde '@biosstel/shell' o desde './store'.
 */

export {
  store,
  STORE_KEYS,
  type RootState,
  type AppDispatch,
} from './store';

export { useAppDispatch, useAppSelector } from './hooks';

export {
  adminApi,
  useGetUsersQuery,
  useLoginMutation,
  useAddUserMutation,
} from './api/users';
