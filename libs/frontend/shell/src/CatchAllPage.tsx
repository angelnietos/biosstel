'use client';

import { useEffect, useState, useRef, type ComponentType } from 'react';
import { useParams } from 'next/navigation';
import { useRouter, canFichar, canManageFichajes } from '@biosstel/platform';
import { getRouteKind, getRoute, ADMIN_WORKSPACE_SEGMENTS } from './routeRegistry';
import { FeatureLoading } from '@biosstel/ui';
import { WorkspaceModalShell, PATHS, getReturnPath } from '@biosstel/shared';
import { useAppSelector, STORE_KEYS } from './store';

function normalizePath(path: string | string[] | undefined): string[] {
  if (path == null) return [];
  return Array.isArray(path) ? path : [path];
}

/** next-intl adds the locale to the path, so we pass paths without locale to avoid /en/en/home */
function replacePath(router: ReturnType<typeof useRouter>, path: string) {
  router.replace(path);
}

export default function CatchAllPage() {
  const params = useParams();
  const router = useRouter();
  const rawPath = normalizePath(params?.path);
  const locale = rawPath[0] ?? 'es';
  const segments = rawPath.slice(1);
  const currentPathKeyRef = useRef<string>('');
  const authRestored = useAppSelector((state) => state[STORE_KEYS.auth]?.authRestored);
  const userRole = useAppSelector((state) => state[STORE_KEYS.auth]?.user?.role);

  const [Component, setComponent] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [routeProps, setRouteProps] = useState<Record<string, string>>({});
  const [routeKind, setRouteKind] = useState<string | null>(null);

  useEffect(() => {
    if (rawPath.length === 0) {
      setComponent(null);
      replacePath(router, '/es');
      return;
    }
    // Root con locale (ej. /en) → mostrar home y corregir URL sin doble locale
    if (segments.length === 0) {
      replacePath(router, PATHS.HOME);
      const route = getRoute(['home']);
      if (route) {
        currentPathKeyRef.current = 'home';
        setRouteKind('main');
        setRouteProps(route.props);
        route.entry.loader().then((mod) => {
          if (currentPathKeyRef.current === 'home') {
            setComponent(() => mod.default);
          }
        });
      } else {
        setComponent(null);
      }
      return;
    }
    const pathKey = segments.join('/');
    // /operaciones sin subruta → redirigir a la vista según rol (OperacionesShell sin children está vacía)
    if (pathKey === 'operaciones' && authRestored) {
      const role = (userRole ?? '').toString().toUpperCase();
      const operacionesByRole: Record<string, string> = {
        COMERCIAL: PATHS.OPERACIONES_COMERCIAL,
        TELEMARKETING: PATHS.OPERACIONES_TELEMARKETING,
        BACKOFFICE: PATHS.OPERACIONES_BACKOFFICE,
        TIENDA: PATHS.OPERACIONES_TIENDA,
      };
      const targetPath = operacionesByRole[role] ?? PATHS.OPERACIONES_COMERCIAL;
      setComponent(null);
      replacePath(router, targetPath);
      return;
    }
    // /empresa sin subruta → mostrar Departamentos directamente (EmpresaShell está vacío; evitar redirect por si falla con next-intl)
    if (pathKey === 'empresa') {
      const empresaRoute = getRoute(['empresa', 'departamentos']);
      if (empresaRoute) {
        currentPathKeyRef.current = 'empresa';
        setRouteKind('main');
        setRouteProps(empresaRoute.props);
        empresaRoute.entry.loader().then((mod) => {
          if (currentPathKeyRef.current === 'empresa') {
            setComponent(() => mod.default);
          }
        });
      } else {
        setComponent(null);
        replacePath(router, PATHS.EMPRESA_DEPARTAMENTOS ?? '/empresa/departamentos');
      }
      return;
    }
    // Empleados (pueden fichar pero no gestionar) → ir a control de jornada, no al listado admin
    const isEmployeeOnly = pathKey === 'fichajes' && authRestored && userRole != null && userRole !== '' && canFichar(userRole) && !canManageFichajes(userRole);
    if (isEmployeeOnly) {
      setComponent(null);
      replacePath(router, '/fichajes/control-jornada');
      return;
    }
    const kind = getRouteKind(segments);
    if (kind === 'redirect-resultados') {
      setComponent(null);
      replacePath(router, PATHS.OBJETIVOS_TERMINALES);
      return;
    }
    const route = getRoute(segments);
    if (!route) {
      setComponent(null);
      replacePath(router, PATHS.HOME);
      return;
    }
    currentPathKeyRef.current = pathKey;
    setRouteKind(kind);
    setRouteProps(route.props);
    route.entry.loader().then((mod) => {
      if (currentPathKeyRef.current === pathKey) {
        setComponent(() => mod.default);
      }
    });
  }, [locale, segments.join('/'), router, rawPath.length, authRestored, userRole]);

  if (!Component) {
    return <FeatureLoading />;
  }

  const content = <Component {...routeProps} />;
  const isAdminWorkspace = routeKind === 'admin' && segments[0] && ADMIN_WORKSPACE_SEGMENTS.has(segments[0]);

  if (isAdminWorkspace && segments[0]) {
    const path = segments[0] === 'add-user' ? PATHS.ADD_USER : PATHS.ADD_CLIENT;
    const returnHref = `/${locale}${getReturnPath(path)}`;
    const returnLabel = path === PATHS.ADD_USER ? 'Volver a usuarios' : 'Volver al inicio';
    return (
      <WorkspaceModalShell returnHref={returnHref} returnLabel={returnLabel} maxWidth="l">
        {content}
      </WorkspaceModalShell>
    );
  }

  return content;
}
