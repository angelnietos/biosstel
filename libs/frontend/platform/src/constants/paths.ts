/**
 * App route paths. Used by shell (nav, layout, permissions) and route registry.
 */
const PATHS = {
  LOGIN: '/',
  /** Route path for "forgot password" page (not a credential). */
  FORGOT_PASSWORD: '/forgot-password', // NOSONAR S2068 - route path, not a hard-coded password
  EMAIL_SEND: '/email-send',
  VERIFY_ACCOUNT: '/verify-account',
  REGISTRO_SALIDA: '/registro-salida',
  HOME: '/home',
  BACKOFFICE: '/backOffice',
  INVENTORY: '/inventory',
  REPORTS: '/reports',
  OBJECTIVES: '/home/objectives',
  PENDING_TASKS: '/home/pending-tasks',
  REGISTER_TASKS: '/home/register-tasks',
  ADD_USER: '/add-user',
  ADD_CLIENT: '/add-client',
  CONFIGURACION_PERFIL: '/configuracion-perfil',
  USERS: '/users',
  OBJETIVOS: '/objetivos',
  OBJETIVOS_TERMINALES: '/objetivos-terminales',
  RESULTADOS: '/objetivos-terminales',
  PRODUCTOS: '/productos',
  PRODUCTOS_NUEVO: '/productos/nuevo',
  EMPRESA: '/empresa',
  EMPRESA_DEPARTAMENTOS: '/empresa/departamentos',
  EMPRESA_CENTROS: '/empresa/centros-trabajo',
  EMPRESA_CUENTAS: '/empresa/cuentas-contables',
  FICHAJES: '/fichajes',
  FICHAJES_CONTROL: '/fichajes/control-jornada',
  FICHAJES_HORARIOS: '/fichajes/horarios',
  FICHAJES_CALENDARIO: '/fichajes/calendario-laboral',
  FICHAJES_MANUAL: '/fichajes/fichaje-manual',
  FICHAJES_PERMISOS: '/fichajes/permisos',
  FICHAJES_GEOLOCALIZACION: '/fichajes/geolocalizacion',
  OPERACIONES: '/operaciones',
  OPERACIONES_COMERCIAL: '/operaciones/comercial-visitas',
  OPERACIONES_TELEMARKETING: '/operaciones/telemarketing-agenda',
  OPERACIONES_BACKOFFICE: '/operaciones/backoffice-revision',
  OPERACIONES_TIENDA: '/operaciones/tienda-ventas',
  ALERTAS: '/alertas',
  ALERTAS_VENTAS: '/alertas/alertas-ventas',
  ALERTAS_RECORDATORIOS: '/alertas/recordatorios',
  ALERTAS_TRACKING: '/alertas/tracking-alerts',
};

const WORKSPACE_RETURN: Record<string, string> = {
  [PATHS.ADD_USER]: PATHS.USERS,
  [PATHS.ADD_CLIENT]: PATHS.HOME,
};

export function getReturnPath(pathname: string): string {
  return WORKSPACE_RETURN[pathname] ?? PATHS.HOME;
}

export const AUTH_PATHS = [
  '/',
  '/login',
  '/forgot-password',
  '/email-send',
  '/verify-account',
  '/registro-salida',
];

export const SHELL_HOME_PATH = PATHS.HOME;

export default PATHS;
