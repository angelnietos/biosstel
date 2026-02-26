'use client';

import { useSelector } from 'react-redux';
import { normalizeRole } from '@biosstel/platform';
import type { AppRole } from '@biosstel/platform';

/** Estado de auth en el store (compatible con authSlice). */
interface AuthState {
  user?: { role?: AppRole | string | null } | null;
}

/**
 * Devuelve el rol del usuario actual normalizado (AppRole | undefined).
 * Usar para decisiones de UI y permisos sin depender de strings del backend.
 */
export function useAuthRole(): AppRole | undefined {
  const rawRole = useSelector((state: { auth?: AuthState }) => state.auth?.user?.role);
  return normalizeRole(rawRole) ?? undefined;
}
