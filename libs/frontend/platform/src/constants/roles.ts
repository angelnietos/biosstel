export type AppRole =
  | 'ADMIN'
  | 'COORDINADOR'
  | 'TELEMARKETING'
  | 'TIENDA'
  | 'COMERCIAL'
  | 'BACKOFFICE';

export const ROLES: Record<AppRole, string> = {
  ADMIN: 'Administrador',
  COORDINADOR: 'Coordinador',
  TELEMARKETING: 'Telemarketing',
  TIENDA: 'Tienda',
  COMERCIAL: 'Comercial',
  BACKOFFICE: 'Backoffice',
};

/** Mapa label → key para normalizar roles que vienen del backend como texto (ej. "Administrador" → "ADMIN"). */
const ROLE_LABEL_TO_KEY: Record<string, AppRole> = {
  Administrador: 'ADMIN',
  Coordinador: 'COORDINADOR',
  Telemarketing: 'TELEMARKETING',
  Tienda: 'TIENDA',
  Comercial: 'COMERCIAL',
  Backoffice: 'BACKOFFICE',
};

export function normalizeRole(role?: AppRole | string | null): AppRole | undefined {
  if (role == null || role === '') return undefined;
  const key = role as AppRole;
  if (ALL_ROLES.includes(key)) return key;
  const byLabel = ROLE_LABEL_TO_KEY[role as string];
  if (byLabel) return byLabel;
  const upper = String(role).toUpperCase() as AppRole;
  if (ALL_ROLES.includes(upper)) return upper;
  return undefined;
}

export const ROLES_ADMIN_OR_COORDINADOR: AppRole[] = ['ADMIN', 'COORDINADOR'];

/** Roles que tienen jornada y usan "Fichar entrada" (Figma: admin no fica) */
export const ROLES_QUE_FICAN: AppRole[] = ['COMERCIAL', 'TIENDA', 'TELEMARKETING', 'BACKOFFICE'];

/** Roles que gestionan calendarios/horarios/permisos en Fichajes */
export const ROLES_GESTION_FICHAJES: AppRole[] = ['ADMIN', 'COORDINADOR'];

export const ALL_ROLES: AppRole[] = [
  'ADMIN',
  'COORDINADOR',
  'TELEMARKETING',
  'TIENDA',
  'COMERCIAL',
  'BACKOFFICE',
];

export function canFichar(role?: AppRole | string | null): boolean {
  const key = normalizeRole(role);
  if (key == null) return false;
  return ROLES_QUE_FICAN.includes(key);
}

export function canManageFichajes(role?: AppRole | string | null): boolean {
  const key = normalizeRole(role);
  if (key == null) return false;
  return ROLES_GESTION_FICHAJES.includes(key);
}

/** Comprueba si el rol del usuario coincide con el esperado. */
export function hasRole(role?: AppRole | string | null, expectedRole?: AppRole | string | null): boolean {
  const key = normalizeRole(role);
  const expected = normalizeRole(expectedRole);
  if (key == null || expected == null) return false;
  return key === expected;
}

/** Comprueba si el rol del usuario está en la lista. */
export function hasAnyRole(role?: AppRole | string | null, expectedRoles?: (AppRole | string)[] | null): boolean {
  const key = normalizeRole(role);
  if (key == null || expectedRoles == null || expectedRoles.length === 0) return false;
  return expectedRoles.some((r) => normalizeRole(r) === key);
}

/** Devuelve el label del rol para mostrar en UI (ej. "Administrador"). */
export function getRoleLabel(role?: AppRole | string | null): string {
  const key = normalizeRole(role);
  if (key == null) return '';
  return ROLES[key] ?? String(role ?? '');
}
