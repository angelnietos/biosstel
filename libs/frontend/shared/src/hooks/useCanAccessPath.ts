'use client';

import { usePathname } from '@biosstel/platform';
import { useSelector } from 'react-redux';
import { canAccessPath, normalizePath } from '@biosstel/platform';

interface AuthState {
  user?: { role?: string | null } | null;
}

/**
 * Indica si el usuario actual puede acceder a la ruta.
 * @param path - Si no se pasa, usa la ruta actual (pathname).
 */
export function useCanAccessPath(path?: string): boolean {
  const pathname = usePathname() ?? '';
  const normalizedPath = path ?? (normalizePath(pathname) || '/');
  const userRole = useSelector((state: { auth?: AuthState }) => state.auth?.user?.role);
  return canAccessPath(normalizedPath, userRole);
}
