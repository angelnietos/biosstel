'use client';

import { useSelector } from 'react-redux';
import {
  canFichar,
  canManageFichajes,
  hasPermission,
  hasAnyRole,
  type AppRole,
  type PermissionKey,
} from '@biosstel/platform';

interface AuthState {
  user?: { role?: AppRole | string | null } | null;
}

function useUserRole(): AppRole | string | null | undefined {
  return useSelector((state: { auth?: AuthState }) => state.auth?.user?.role);
}

/** True si el usuario puede usar "Fichar entrada/salida" (reloj). */
export function useCanFichar(): boolean {
  const role = useUserRole();
  return canFichar(role);
}

/** True si el usuario puede gestionar calendarios/horarios/permisos en Fichajes. */
export function useCanManageFichajes(): boolean {
  const role = useUserRole();
  return canManageFichajes(role);
}

/** True si el usuario tiene el permiso indicado. */
export function useHasPermission(permission: PermissionKey | string): boolean {
  const role = useUserRole();
  return hasPermission(role, permission);
}

/** True si el usuario tiene al menos uno de los roles indicados. */
export function useHasAnyRole(roles: (AppRole | string)[]): boolean {
  const role = useUserRole();
  return hasAnyRole(role, roles);
}
