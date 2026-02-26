/**
 * Stub for @biosstel/platform in feature tests (avoids Next.js / DOM deps)
 */
export const API_BASE_URL = 'http://test.api/v1';
export const getAuthHeaders = (): Record<string, string> => ({ 'Content-Type': 'application/json' });
export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error('Request failed');
  return res.json() as Promise<T>;
}

/** Stub: normalizes role for auth tests (returns string as-is or undefined). */
export function normalizeRole(role?: string | null): string | undefined {
  if (role == null || role === '') return undefined;
  return String(role);
}

/** Stub PATHS for shared/nav when loading shared in tests (e.g. empresa). */
export const PATHS = {
  LOGIN: '/',
  HOME: '/home',
  BACKOFFICE: '/backOffice',
  INVENTORY: '/inventory',
  REPORTS: '/reports',
  USERS: '/users',
  OBJETIVOS: '/objetivos',
  PRODUCTOS: '/productos',
  EMPRESA: '/empresa',
  FICHAJES: '/fichajes',
  OPERACIONES: '/operaciones',
  ALERTAS: '/alertas',
} as const;

export const AUTH_PATHS = [PATHS.LOGIN] as string[];
export const SHELL_HOME_PATH = PATHS.HOME;
export function getReturnPath(_path: string): string {
  return PATHS.HOME;
}
