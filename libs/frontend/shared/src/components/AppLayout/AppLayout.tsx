'use client';

import { usePathname, hasAnyRole } from '@biosstel/platform';
import { useSelector } from 'react-redux';
import { MainAppLayout } from '../MainAppLayout';
import { ProtectedRoute } from '../ProtectedRoute';
import { ReactNode, useMemo } from 'react';
import type { NavItem } from '../../types/nav';

export interface AppLayoutProps {
  children: ReactNode;
  /** Full list of nav items; will be filtered by canAccessPath(item.path, role) */
  navItems: NavItem[];
  /** Paths that skip protected layout (e.g. login, forgot-password). Checked against pathname (normalized without locale). */
  authPaths: string[];
  /** Path for "Ir al Inicio" when forbidden */
  homePath: string;
  /** (pathnameOrPath, role) => whether the user can access */
  canAccessPath: (pathname: string, role?: string | null) => boolean;
}

/** Strip locale prefix for comparison (e.g. /es/login → /login) */
function normalizePath(pathname: string): string {
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  return withoutLocale === '' ? '/' : withoutLocale;
}

export function AppLayout({
  children,
  navItems,
  authPaths,
  homePath,
  canAccessPath,
}: AppLayoutProps) {
  const pathname = usePathname() ?? '';
  const normalized = normalizePath(pathname);
  const user = useSelector((state: any) => state.auth?.user);
  const userRole = user?.role;

  const isAuthRoute = authPaths.some((p) => normalized === p || normalized.endsWith(p));

  const filteredNavItems = useMemo(
    () =>
      navItems.filter((item) =>
        item.requiredRoles != null && item.requiredRoles.length > 0
          ? hasAnyRole(userRole, item.requiredRoles)
          : canAccessPath(item.path, userRole)
      ),
    [navItems, userRole, canAccessPath]
  );

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute homePath={homePath} canAccessPath={canAccessPath}>
      <MainAppLayout
        navItems={filteredNavItems}
        userName={user?.name ?? user?.email ?? 'Usuario'}
        userRole={user?.role ?? null}
      >
        {children}
      </MainAppLayout>
    </ProtectedRoute>
  );
}
