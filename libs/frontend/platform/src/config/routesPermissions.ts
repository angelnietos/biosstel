import type { AppRole } from '../constants/roles';
import { ALL_ROLES, ROLES_ADMIN_OR_COORDINADOR, normalizeRole } from '../constants/roles';
import PATHS from '../constants/paths';

export interface RoutePermission {
  path: string;
  prefix?: boolean;
  roles: AppRole[];
}

export function normalizePath(pathname: string): string {
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  return withoutLocale === '' ? '/' : withoutLocale;
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  { path: '/', roles: ALL_ROLES },
  { path: '/login', roles: ALL_ROLES },
  { path: '/forgot-password', roles: ALL_ROLES },
  { path: '/email-send', roles: ALL_ROLES },
  { path: '/verify-account', roles: ALL_ROLES },
  { path: '/registro-salida', roles: ALL_ROLES },
  { path: PATHS.HOME, prefix: true, roles: ALL_ROLES },
  { path: '/resultados', roles: ALL_ROLES },
  { path: '/fichajes', prefix: true, roles: ALL_ROLES },
  { path: '/clock', roles: ALL_ROLES },
  { path: PATHS.USERS, prefix: true, roles: ROLES_ADMIN_OR_COORDINADOR },
  { path: PATHS.ADD_USER, roles: ROLES_ADMIN_OR_COORDINADOR },
  { path: PATHS.ADD_CLIENT, roles: ROLES_ADMIN_OR_COORDINADOR },
  { path: PATHS.CONFIGURACION_PERFIL, roles: ALL_ROLES },
  { path: PATHS.OBJETIVOS, prefix: true, roles: ['ADMIN', 'COORDINADOR', 'COMERCIAL', 'TIENDA', 'TELEMARKETING'] },
  { path: PATHS.OBJETIVOS_TERMINALES, roles: ['ADMIN', 'COORDINADOR', 'COMERCIAL', 'TIENDA', 'TELEMARKETING'] },
  { path: PATHS.PRODUCTOS, roles: ['ADMIN', 'COORDINADOR', 'TIENDA'] },
  { path: PATHS.INVENTORY, roles: ['ADMIN', 'COORDINADOR', 'TIENDA'] },
  { path: PATHS.REPORTS, roles: ROLES_ADMIN_OR_COORDINADOR },
  { path: '/alertas', prefix: true, roles: ALL_ROLES },
  { path: '/operaciones/comercial-visitas', roles: ['ADMIN', 'COORDINADOR', 'COMERCIAL'] },
  { path: '/operaciones/telemarketing-agenda', roles: ['ADMIN', 'COORDINADOR', 'TELEMARKETING'] },
  { path: '/operaciones/backoffice-revision', roles: ['ADMIN', 'COORDINADOR', 'BACKOFFICE'] },
  { path: '/operaciones/tienda-ventas', roles: ['ADMIN', 'COORDINADOR', 'TIENDA'] },
  { path: '/operaciones', prefix: true, roles: ['ADMIN', 'COORDINADOR', 'COMERCIAL', 'TELEMARKETING', 'TIENDA', 'BACKOFFICE'] },
  { path: '/empresa', prefix: true, roles: ROLES_ADMIN_OR_COORDINADOR },
  { path: PATHS.BACKOFFICE, roles: ['ADMIN', 'COORDINADOR', 'BACKOFFICE'] },
];

export function canAccessPath(pathname: string, userRole?: AppRole | string | null): boolean {
  const normalized = normalizePath(pathname);
  if (userRole == null || userRole === '') return true;
  const role = normalizeRole(userRole);
  if (role === 'ADMIN') return true;
  if (role == null) return true;
  const exactMatch = ROUTE_PERMISSIONS.find((p) => !p.prefix && p.path === normalized);
  if (exactMatch) return exactMatch.roles.includes(role);
  const withPrefix = ROUTE_PERMISSIONS.filter((p) => p.prefix && normalized.startsWith(p.path))
    .sort((a, b) => b.path.length - a.path.length);
  const firstPrefix = withPrefix[0];
  if (firstPrefix) return firstPrefix.roles.includes(role);
  return true;
}
