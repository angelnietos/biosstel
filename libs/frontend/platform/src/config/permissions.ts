/**
 * Sistema de permisos por rol.
 * Fuente única de verdad para capacidades (fichar, gestionar fichajes, usuarios, etc.).
 */

import type { AppRole } from '../constants/roles';
import { normalizeRole } from '../constants/roles';

/** Claves de permiso para control fino (opcional en UI). */
export const PERMISSIONS = {
  /** Ver y gestionar usuarios, add-user, add-client */
  USERS_VIEW: 'users:view',
  USERS_MANAGE: 'users:manage',
  /** Fichar entrada/salida (reloj) */
  FICHAR: 'fichar',
  /** Gestionar calendarios, horarios, permisos de fichajes */
  FICHAJES_MANAGE: 'fichajes:manage',
  /** Ver reportes */
  REPORTS_VIEW: 'reports:view',
  /** Ver y gestionar empresa (departamentos, centros, cuentas) */
  EMPRESA_VIEW: 'empresa:view',
  EMPRESA_MANAGE: 'empresa:manage',
  /** Objetivos */
  OBJETIVOS_VIEW: 'objetivos:view',
  /** Productos e inventario */
  PRODUCTOS_VIEW: 'productos:view',
  INVENTORY_VIEW: 'inventory:view',
  /** Operaciones por canal */
  OPERACIONES_COMERCIAL: 'operaciones:comercial',
  OPERACIONES_TELEMARKETING: 'operaciones:telemarketing',
  OPERACIONES_BACKOFFICE: 'operaciones:backoffice',
  OPERACIONES_TIENDA: 'operaciones:tienda',
  /** Back office */
  BACKOFFICE_VIEW: 'backoffice:view',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Mapa rol → permisos. ADMIN tiene todos implícitos (se comprueba en hasPermission). */
const ROLE_PERMISSIONS: Record<AppRole, PermissionKey[]> = {
  ADMIN: Object.values(PERMISSIONS),
  COORDINADOR: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.FICHAJES_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.EMPRESA_VIEW,
    PERMISSIONS.EMPRESA_MANAGE,
    PERMISSIONS.OBJETIVOS_VIEW,
    PERMISSIONS.PRODUCTOS_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.OPERACIONES_COMERCIAL,
    PERMISSIONS.OPERACIONES_TELEMARKETING,
    PERMISSIONS.OPERACIONES_BACKOFFICE,
    PERMISSIONS.OPERACIONES_TIENDA,
    PERMISSIONS.BACKOFFICE_VIEW,
  ],
  TELEMARKETING: [
    PERMISSIONS.FICHAR,
    PERMISSIONS.OBJETIVOS_VIEW,
    PERMISSIONS.OPERACIONES_TELEMARKETING,
  ],
  TIENDA: [
    PERMISSIONS.FICHAR,
    PERMISSIONS.OBJETIVOS_VIEW,
    PERMISSIONS.PRODUCTOS_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.OPERACIONES_TIENDA,
  ],
  COMERCIAL: [
    PERMISSIONS.FICHAR,
    PERMISSIONS.OBJETIVOS_VIEW,
    PERMISSIONS.OPERACIONES_COMERCIAL,
  ],
  BACKOFFICE: [
    PERMISSIONS.FICHAR,
    PERMISSIONS.OPERACIONES_BACKOFFICE,
    PERMISSIONS.BACKOFFICE_VIEW,
  ],
};

/**
 * Indica si el rol tiene el permiso (ADMIN tiene todos).
 */
export function hasPermission(
  role?: AppRole | string | null,
  permission?: PermissionKey | string | null
): boolean {
  const r = normalizeRole(role);
  if (r == null || permission == null || permission === '') return false;
  if (r === 'ADMIN') return true;
  const list = ROLE_PERMISSIONS[r];
  return list?.includes(permission as PermissionKey) ?? false;
}

/**
 * Indica si el rol tiene al menos uno de los permisos.
 */
export function hasAnyPermission(
  role?: AppRole | string | null,
  permissions?: (PermissionKey | string)[] | null
): boolean {
  if (permissions == null || permissions.length === 0) return false;
  return permissions.some((p) => hasPermission(role, p));
}
