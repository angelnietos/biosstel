'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, logUserAction } from '@biosstel/platform';
import { FeatureLoading } from '@biosstel/ui';
import { logout } from '../data-access/store/authSlice';

/**
 * Página de cierre de sesión: despacha logout (limpia token y usuario) y redirige a login.
 * Ruta: /logout
 */
export function LogoutPage() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  useEffect(() => {
    logUserAction('logout');
    dispatch(logout());
    router.replace('/login');
  }, [dispatch, router]);

  return <FeatureLoading />;
}
