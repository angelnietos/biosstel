'use client';

/**
 * @biosstel/shared - Componentes compartidos entre features
 *
 * Solo componentes que varias features reutilizan (layouts, composiciones).
 * Los componentes de UI atómicos (Button, Input, Chip, Tooltip, etc.) están en @biosstel/ui.
 * Las features se componen exclusivamente con @biosstel/ui y @biosstel/shared.
 */

export { AuthLayout, type AuthLayoutProps } from './components/AuthLayout';
export { PageContent, type PageContentProps } from './components/PageContent';
export { TextLink, type TextLinkProps } from './components/TextLink';
export { BlockLink, type BlockLinkProps } from './components/BlockLink';
export { ButtonLink, type ButtonLinkProps } from './components/ButtonLink';
export { MainAppLayout, type MainAppLayoutProps } from './components/MainAppLayout';
export { Sidebar, type SidebarProps } from './components/Sidebar';
export { Header, type HeaderProps } from './components/Header';
export { MobileBar, type MobileBarProps } from './components/MobileBar';
export { WorkspaceModalShell, type WorkspaceModalShellProps } from './components/WorkspaceModalShell';
export { ProtectedRoute, type ProtectedRouteProps } from './components/ProtectedRoute';
export { AppLayout, type AppLayoutProps } from './components/AppLayout';
export { Can, type CanProps } from './components/Can';
export { AddDepartmentModal, type AddDepartmentModalProps } from './components/AddDepartmentModal';
export { AlertsTable, type AlertsTableProps } from './components/AlertsTable';
export type { AddDepartmentFormData } from './types/addDepartmentForm';
export { getDepartments, getWorkCenters, createDepartment, updateDepartment, type UpdateDepartmentData } from './services/empresa';
export { LocaleLang } from './components/LocaleLang';
export { GlobalErrorFallback } from './components/GlobalErrorFallback';
export { Version } from './components/Version';
export { AppProviders, type AppProvidersProps } from './components/AppProviders';
export type { NavItem } from './types/nav';
export type { IconProps } from './types/icons';
export { SortColumn } from './types/sortColumn';
export { default as PATHS, getReturnPath, AUTH_PATHS, SHELL_HOME_PATH } from './constants/paths';
export type { AppRole } from './constants/roles';
export { ROLES, ROLES_ADMIN_OR_COORDINADOR, ALL_ROLES } from './constants/roles';
export { navItems } from './constants/navItems';
export { BASEURL, ENDPOINTS } from './constants/endpoints';
export { customToastSuccess, customToastError } from './constants/toastConfig';
export { TABLE_CONDITIONALS } from './constants/tableConditionals';
export { ITEMS_PER_PAGE_OPTIONS } from './constants/itemsPerPageOptions';

export {
  useAuthRole,
  useCanAccessPath,
  useCanFichar,
  useCanManageFichajes,
  useHasPermission,
  useHasAnyRole,
} from './hooks';

export { routing } from './i18n/routing';
