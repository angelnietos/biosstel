/**
 * @biosstel/shell - Wrapper para la ruta home: dispara fetchCurrentFichaje y renderiza DashboardHomePage.
 * Evita que objetivos importe de fichajes; el shell orquesta ambas features.
 */

'use client';

import { useEffect } from 'react';
import { canFichar } from '@biosstel/platform';
import { fetchCurrentFichaje } from '@biosstel/fichajes';
import { DashboardHomePage } from '@biosstel/objetivos';
import { useAppDispatch, useAppSelector, STORE_KEYS } from './store';

export function HomePageWithFichaje() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state[STORE_KEYS.auth]?.user);
  const userId = authUser?.id;
  const userRole = authUser?.role;
  const showFicharEntrada = canFichar(userRole);

  useEffect(() => {
    if (showFicharEntrada && userId) {
      dispatch(fetchCurrentFichaje(userId));
    }
  }, [showFicharEntrada, userId, dispatch]);

  return <DashboardHomePage />;
}
