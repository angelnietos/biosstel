'use client';

import { type ReactNode } from 'react';
import {
  useAuthRole,
  useCanFichar,
  useCanManageFichajes,
  useHasPermission,
  useHasAnyRole,
} from '../../hooks';
import type { AppRole, PermissionKey } from '@biosstel/platform';

export interface CanProps {
  children: ReactNode;
  /**
   * Renderizar solo si el usuario tiene exactamente este rol.
   */
  role?: AppRole;
  /**
   * Renderizar solo si el usuario tiene al menos uno de estos roles.
   */
  oneOf?: (AppRole | string)[];
  /**
   * Renderizar solo si el usuario tiene este permiso (ej. PERMISSIONS.USERS_VIEW).
   */
  permission?: PermissionKey | string;
  /**
   * Atajo: true si el usuario puede fichar (reloj).
   */
  canFichar?: boolean;
  /**
   * Atajo: true si el usuario puede gestionar fichajes (calendarios/horarios/permisos).
   */
  canManageFichajes?: boolean;
  /**
   * Si true, se muestra children cuando NO se cumple la condición (invertido).
   */
  fallback?: ReactNode;
}

/**
 * Renderiza children solo si se cumple la condición de rol/permiso.
 * Usar para ocultar botones, bloques o enlaces según el usuario.
 */
export function Can({
  children,
  role,
  oneOf,
  permission,
  canFichar: canFicharProp,
  canManageFichajes: canManageFichajesProp,
  fallback = null,
}: CanProps) {
  const userRole = useAuthRole();
  const canFicharValue = useCanFichar();
  const canManageFichajesValue = useCanManageFichajes();
  const hasPerm = useHasPermission(permission ?? '');
  const hasAny = useHasAnyRole(oneOf ?? []);

  let allowed = false;
  if (role != null) {
    allowed = userRole === role;
  } else if (oneOf != null && oneOf.length > 0) {
    allowed = hasAny;
  } else if (permission != null) {
    allowed = hasPerm;
  } else if (canFicharProp === true) {
    allowed = canFicharValue;
  } else if (canManageFichajesProp === true) {
    allowed = canManageFichajesValue;
  }

  if (allowed) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
