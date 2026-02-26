'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useLocale, usePathname } from '@biosstel/platform';
import { useSelector } from 'react-redux';
import { CenteredLayout } from '@biosstel/ui-layout';
import { Text, Button } from '@biosstel/ui';
import { Link } from '@biosstel/platform';

export interface ProtectedRouteProps {
  children: ReactNode;
  /** Path to redirect when not authenticated (e.g. /login). Locale is prepended by the component. */
  loginPath?: string;
  /** Path for "Ir al Inicio" when forbidden (e.g. /home). Locale is prepended. */
  homePath: string;
  /** (pathname, role) => whether the user can access the current path */
  canAccessPath: (pathname: string, role?: string | null) => boolean;
}

type AuthStatus = 'pending' | 'authenticated' | 'redirecting' | 'forbidden';

export function ProtectedRoute({
  children,
  loginPath = '/login',
  homePath,
  canAccessPath,
}: ProtectedRouteProps) {
  const locale = useLocale();
  const pathname = usePathname() ?? '';
  const normalized = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || pathname || '/';
  const token = useSelector((state: any) => state.auth?.token);
  const user = useSelector((state: any) => state.auth?.user);
  const [status, setStatus] = useState<AuthStatus>('pending');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasToken = token ?? localStorage.getItem('token');
    if (hasToken || user) {
      const allowed = canAccessPath(normalized, user?.role);
      setStatus(allowed ? 'authenticated' : 'forbidden');
      return;
    }
    setStatus('redirecting');
    window.location.replace(`/${locale}${loginPath}`);
  }, [locale, pathname, token, user, loginPath, canAccessPath]);

  if (status === 'pending' || status === 'redirecting') {
    return (
      <CenteredLayout className="min-h-screen bg-gray-100">
        <Text variant="muted">
          {status === 'redirecting' ? 'Redirigiendo al inicio de sesión…' : 'Comprobando sesión…'}
        </Text>
      </CenteredLayout>
    );
  }

  if (status === 'forbidden') {
    return (
      <CenteredLayout className="min-h-screen bg-gray-100">
        <div className="text-center max-w-md">
          <Text variant="body" className="font-semibold text-gray-900 mb-2">
            Sin permiso
          </Text>
          <Text variant="muted" className="block mb-4">
            No tienes acceso a esta sección. Contacta con el administrador si crees que es un error.
          </Text>
          <Link href={`/${locale}${homePath}`}>
            <Button variant="primary">Ir al Inicio</Button>
          </Link>
        </div>
      </CenteredLayout>
    );
  }

  return <>{children}</>;
}
