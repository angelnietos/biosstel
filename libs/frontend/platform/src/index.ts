/**
 * @biosstel/platform - Platform Adapters Library
 *
 * This library provides adapters for Next.js-specific functionality.
 * It acts as a bridge between the framework-agnostic features and Next.js.
 *
 * This allows features to be framework-independent and easily portable
 * to other frameworks (Remix, React Router, etc.) by swapping this adapter.
 *
 * PRINCIPLES:
 * - Contains ONLY Next.js-specific integrations
 * - Features import from here, not directly from next/*
 * - Swappable for other frameworks
 * - No business logic here
 *
 * DEPENDENCIES:
 * - next (Next.js)
 * - react
 *
 * EXAMPLES OF ADAPTERS:
 * - Link component (routing)
 * - useRouter hook
 * - Server components helpers
 * - next-intl integration
 * - NextAuth.js integration
 */

// Routing (useLocale from next-intl via routing barrel so bundler sees it)
export { Link, useRouter, usePathname, redirect, useLocale, type LinkProps } from './routing';

// API configuration
export {
  API_BASE_URL,
  getAuthHeaders,
  handleResponse,
  setUnauthorizedHandler,
  setApiErrorHandler,
} from './api';

// App config: paths, roles, route permissions
export { default as PATHS, getReturnPath, AUTH_PATHS, SHELL_HOME_PATH } from './constants/paths';
export type { AppRole } from './constants/roles';
export {
  ROLES,
  ROLES_ADMIN_OR_COORDINADOR,
  ALL_ROLES,
  ROLES_QUE_FICAN,
  ROLES_GESTION_FICHAJES,
  canFichar,
  canManageFichajes,
  hasRole,
  hasAnyRole,
  getRoleLabel,
  normalizeRole,
} from './constants/roles';
export { canAccessPath, normalizePath, ROUTE_PERMISSIONS } from './config/routesPermissions';
export type { RoutePermission } from './config/routesPermissions';
export {
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
} from './config/permissions';
export type { PermissionKey } from './config/permissions';

export { DevFlowLoggerInit } from './dev-flow-logger/DevFlowLoggerInit';
export {
  logFlow,
  logNavigation,
  logApiRequest,
  logApiResponse,
  logApiError,
  logFormSubmit,
  logUserAction,
  logError,
  getFlowLog,
  clearFlowLog,
  getFlowLogAsContext,
  exposeFlowLogOnWindow,
} from './dev-flow-logger';
export type { FlowLogEntry, FlowLogKind } from './dev-flow-logger/types';
