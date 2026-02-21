/**
 * @biosstel/shell - App shell: routing + store composition
 *
 * Owns: route registry, catch-all page, shell/root layout, and global store (feature reducers + api).
 * The app (front-biosstel) is a thin entry point that imports from shell.
 */

export { getRouteKind, getRoute, AUTH_SEGMENTS, ADMIN_WORKSPACE_SEGMENTS } from './routeRegistry';
export type { RouteKind, RouteEntry } from './routeRegistry';
export { default as CatchAllPage } from './CatchAllPage';
export { ShellLayout } from './ShellLayout';
export { RootLayoutView } from './RootLayoutView';

export {
  store,
  STORE_KEYS,
  type RootState,
  type AppDispatch,
  useAppDispatch,
  useAppSelector,
  adminApi,
  useGetUsersQuery,
  useLoginMutation,
  useAddUserMutation,
} from './store';
