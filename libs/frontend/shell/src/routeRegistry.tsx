/**
 * Registry: path (without locale) → lazy feature component.
 * Shell owns routing; this is the single place that maps URLs to features.
 */

'use client';

import dynamic from 'next/dynamic';
import { useRouter } from '@biosstel/platform';
import { FeatureLoading } from '@biosstel/ui';
import { PATHS, getReturnPath } from '@biosstel/shared';

const loading = () => <FeatureLoading />;

export type RouteEntry =
  | { path: string; loader: () => Promise<{ default: React.ComponentType<any> }>; getProps?: never }
  | {
      path: string;
      loader: () => Promise<{ default: React.ComponentType<any> }>;
      getProps: (slug: string[]) => Record<string, string>;
    };

function pathToRegex(path: string): RegExp {
  const pattern = path.replace(/:[^/]+/g, '([^/]+)');
  return new RegExp(`^${pattern}$`);
}

function matchPath(slug: string[], path: string): Record<string, string> | null {
  const pathStr = slug.join('/');
  const regex = pathToRegex(path);
  const m = pathStr.match(regex);
  if (!m) return null;
  const keys = [...path.matchAll(/:([^/]+)/g)].map((x) => x[1]);
  const props: Record<string, string> = {};
  keys.forEach((k, i) => {
    props[k] = m[i + 1] ?? '';
  });
  return props;
}

export const AUTH_SEGMENTS = new Set([
  'login',
  'forgot-password',
  'email-send',
  'verify-account',
  'registro-salida',
]);

export const ADMIN_WORKSPACE_SEGMENTS = new Set(['add-user', 'add-client']);

const MAIN_ROUTES: RouteEntry[] = [
  { path: 'logout', loader: () => import('@biosstel/auth').then((m) => ({ default: m.LogoutPage })) },
  { path: 'home', loader: () => import('./HomePageWithFichaje').then((m) => ({ default: m.HomePageWithFichaje })) },
  { path: 'clock', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.FichajeDashboard })) },
  { path: 'backOffice', loader: () => import('@biosstel/operaciones').then((m) => ({ default: () => <m.BackOfficeLanding paths={{ home: PATHS.HOME, backofficeRevision: PATHS.OPERACIONES_BACKOFFICE, users: PATHS.USERS, alertas: PATHS.ALERTAS }} /> })) },
  { path: 'productos', loader: () => import('@biosstel/productos').then((m) => ({ default: () => <m.ProductosPage paths={{ inventory: PATHS.INVENTORY, newProduct: PATHS.PRODUCTOS_NUEVO }} /> })) },
  { path: 'productos/nuevo', loader: () => import('@biosstel/productos').then((m) => ({ default: () => <m.NuevoProductoPage productsListPath={PATHS.PRODUCTOS} /> })) },
  { path: 'productos/editar/:id', loader: () => import('@biosstel/productos').then((m) => ({ default: (p: { productId: string }) => <m.EditarProductoPage productId={p.productId} productsListPath={PATHS.PRODUCTOS} /> })), getProps: (s) => ({ productId: s[2] ?? '' }) },
  { path: 'inventory', loader: () => import('@biosstel/inventory').then((m) => ({ default: m.InventoryPage })) },
  { path: 'reports', loader: () => import('@biosstel/reports').then((m) => ({ default: m.ReportsPage })) },
  { path: 'objetivos', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.Niveles })) },
  { path: 'objetivos/familia', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.ObjetivosFamiliaPage })) },
  { path: 'objetivos/producto', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.ObjetivosProductoPage })) },
  { path: 'objetivos-terminales', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.TerminalObjectivesPage })) },
  { path: 'fichajes', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.FichajeDashboard })) },
  { path: 'empresa', loader: () => import('@biosstel/empresa').then((m) => ({ default: m.EmpresaShell })) },
  { path: 'alertas', loader: () => import('@biosstel/alertas').then((m) => ({ default: () => <m.AlertasShell><m.AlertsDashboard /></m.AlertasShell> })) },
  { path: 'operaciones', loader: () => import('@biosstel/operaciones').then((m) => ({ default: m.OperacionesShell })) },
  { path: 'home/objectives', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.TerminalObjectivesPage })) },
  { path: 'home/objectives/:id', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.ObjectiveDetailPage })), getProps: (s) => ({ objectiveId: s[2] ?? '' }) },
  { path: 'home/pending-tasks', loader: () => import('@biosstel/fichajes').then((m) => ({ default: () => <m.PendingTasksPage paths={{ home: PATHS.HOME, pendingTasks: PATHS.PENDING_TASKS, registerTasks: PATHS.REGISTER_TASKS }} /> })) },
  { path: 'home/pending-tasks/:id', loader: () => import('@biosstel/fichajes').then((m) => ({ default: (p: { taskId: string }) => <m.PendingTaskDetailPage taskId={p.taskId} paths={{ home: PATHS.HOME, pendingTasks: PATHS.PENDING_TASKS, registerTasks: PATHS.REGISTER_TASKS }} /> })), getProps: (s) => ({ taskId: s[2] ?? '' }) },
  { path: 'home/register-tasks', loader: () => import('@biosstel/fichajes').then((m) => ({ default: () => <m.RegisterTasksPage paths={{ home: PATHS.HOME, pendingTasks: PATHS.PENDING_TASKS, registerTasks: PATHS.REGISTER_TASKS }} /> })) },
  { path: 'objetivos/asignacion-personas', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.AsignacionPersonas })) },
  { path: 'objetivos/asignacion-departamentos', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.AsignacionDepartamentos })) },
  { path: 'objetivos/historico-objetivos', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.HistoricoObjetivos })) },
  { path: 'objetivos/niveles', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.Niveles })) },
  { path: 'objetivos/plantillas', loader: () => import('@biosstel/objetivos').then((m) => ({ default: m.Plantillas })) },
  { path: 'fichajes/control-jornada', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.ControlJornada })) },
  { path: 'fichajes/horarios', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.Horarios })) },
  { path: 'fichajes/calendario-laboral', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.CalendarioLaboral })) },
  { path: 'fichajes/fichaje-manual', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.FichajeManual })) },
  { path: 'fichajes/permisos', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.Permisos })) },
  { path: 'fichajes/geolocalizacion', loader: () => import('@biosstel/fichajes').then((m) => ({ default: m.Geolocalizacion })) },
  { path: 'empresa/departamentos', loader: () => import('@biosstel/empresa').then((m) => ({ default: m.Departamentos })) },
  { path: 'empresa/centros-trabajo', loader: () => import('@biosstel/empresa').then((m) => ({ default: m.CentrosTrabajo })) },
  { path: 'empresa/cuentas-contables', loader: () => import('@biosstel/empresa').then((m) => ({ default: m.CuentasContables })) },
  { path: 'alertas/alertas-ventas', loader: () => import('@biosstel/alertas').then((m) => ({ default: m.AlertasVentas })) },
  { path: 'alertas/recordatorios', loader: () => import('@biosstel/alertas').then((m) => ({ default: m.Recordatorios })) },
  { path: 'alertas/tracking-alerts', loader: () => import('@biosstel/alertas').then((m) => ({ default: m.TrackingAlerts })) },
  { path: 'operaciones/comercial-visitas', loader: () => import('@biosstel/operaciones').then((m) => ({ default: m.ComercialVisitas })) },
  { path: 'operaciones/telemarketing-agenda', loader: () => import('@biosstel/operaciones').then((m) => ({ default: m.TelemarketingAgenda })) },
  { path: 'operaciones/backoffice-revision', loader: () => import('@biosstel/operaciones').then((m) => ({ default: m.BackofficeRevision })) },
  { path: 'operaciones/tienda-ventas', loader: () => import('@biosstel/operaciones').then((m) => ({ default: m.TiendaVentas })) },
];

const ADMIN_ROUTES: RouteEntry[] = [
  { path: 'users', loader: () => import('@biosstel/usuarios').then((m) => ({ default: () => <div className="py-6"><m.UsersDashboard /></div> })) },
  { path: 'configuracion-perfil', loader: () => import('@biosstel/usuarios').then((m) => ({ default: m.ConfiguracionPerfil })) },
  { path: 'add-user', loader: () => import('@biosstel/usuarios').then((m) => ({ default: AddUserWithSubmit })) },
  { path: 'add-client', loader: () => import('@biosstel/usuarios').then((m) => ({ default: m.AddClientForm })) },
  { path: 'users/:id', loader: () => import('@biosstel/usuarios').then((m) => ({ default: (p: { userId: string }) => <m.UsersLayout><m.DetalleUsuario userId={p.userId} /></m.UsersLayout> })), getProps: (s) => ({ userId: s[1] ?? '' }) },
  { path: 'users/:id/documentacion', loader: () => import('@biosstel/usuarios').then((m) => ({ default: (p: { userId: string }) => <m.UsersLayout><m.Documentacion userId={p.userId} /></m.UsersLayout> })), getProps: (s) => ({ userId: s[1] ?? '' }) },
];

const AUTH_ROUTES: RouteEntry[] = [
  { path: 'login', loader: () => import('@biosstel/auth').then((m) => ({ default: () => <m.AuthShell><m.LoginForm /></m.AuthShell> })) },
  { path: 'forgot-password', loader: () => import('@biosstel/auth').then((m) => ({ default: m.ForgotPasswordPage })) },
  { path: 'email-send', loader: () => import('@biosstel/auth').then((m) => ({ default: () => <m.AuthShell><m.EmailSendMessage /></m.AuthShell> })) },
  { path: 'verify-account', loader: () => import('@biosstel/auth').then((m) => ({ default: () => <m.AuthShell><m.VerifyAccountMessage /></m.AuthShell> })) },
  { path: 'registro-salida', loader: () => import('@biosstel/auth').then((m) => ({ default: () => <m.AuthShell><m.RegistroSalida /></m.AuthShell> })) },
];

function AddUserWithSubmit() {
  const AddUserForm = dynamic(() => import('@biosstel/usuarios').then((m) => ({ default: m.AddUserForm })), { loading });
  const router = useRouter();
  const handleSubmit = async (values: any) => {
    const { createUser } = await import('@biosstel/usuarios');
    await createUser({
      email: values.email,
      firstName: values.name,
      lastName: values.last_name,
      phone: values.phone,
      role: values.role || undefined,
      password: values.password || undefined,
      departmentId: values.departmentId || undefined,
      workCenterId: values.workCenterId || undefined,
    });
    const locale = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean)[0] || 'es' : 'es';
    router.push(`/${locale}${getReturnPath(PATHS.ADD_USER)}`);
  };
  return <AddUserForm onSubmit={handleSubmit} cancelHref={getReturnPath(PATHS.ADD_USER)} />;
}

function findRoute(slug: string[], routes: RouteEntry[]): { entry: RouteEntry; props: Record<string, string> } | null {
  for (const entry of routes) {
    const matched = matchPath(slug, entry.path);
    if (matched === null) continue;
    const props = 'getProps' in entry && entry.getProps ? entry.getProps(slug) : matched;
    return { entry, props };
  }
  return null;
}

export type RouteKind = 'auth' | 'admin' | 'main' | 'redirect-resultados' | null;

export function getRouteKind(slug: string[]): RouteKind {
  if (slug.length === 0) return null;
  if (slug[0] === 'resultados') return 'redirect-resultados';
  if (AUTH_SEGMENTS.has(slug[0])) return 'auth';
  if (ADMIN_WORKSPACE_SEGMENTS.has(slug[0]) || slug[0] === 'users' || slug[0] === 'configuracion-perfil') return 'admin';
  return 'main';
}

export function getRoute(slug: string[]): { entry: RouteEntry; props: Record<string, string> } | null {
  const kind = getRouteKind(slug);
  if (kind === 'redirect-resultados') return null;
  if (kind === 'auth') return findRoute(slug, AUTH_ROUTES);
  if (kind === 'admin') return findRoute(slug, ADMIN_ROUTES);
  return findRoute(slug, MAIN_ROUTES);
}
