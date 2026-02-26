'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { normalizeRole } from '@biosstel/platform';
import { setCredentials, setAuthRestored } from '../data-access/store/authSlice';
import { refreshAuth, getStoredRefreshToken } from '../api/services/auth';

function decodeJwtPayload(token: string): { sub?: string; email?: string; name?: string; role?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now();
}

/**
 * Restores auth user from JWT in localStorage when Redux has token but user is null
 * (e.g. after page refresh). Si el access token está expirado, intenta refresh.
 * Sets authRestored when done so role-dependent UI can wait and avoid flash.
 */
export function AuthRestore() {
  const dispatch = useDispatch<any>();
  const token = useSelector((state: any) => state.auth?.token);
  const user = useSelector((state: any) => state.auth?.user);
  const authRestored = useSelector((state: any) => state.auth?.authRestored);
  const hasRunRestore = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || authRestored) return;
    if (hasRunRestore.current) return;
    hasRunRestore.current = true;

    let tokenToUse = token ?? (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const tryRefresh = async (): Promise<string | null> => {
      const result = await refreshAuth();
      return result?.token ?? null;
    };

    const doRestore = (effectiveToken: string | null) => {
      if (effectiveToken) {
        const payload = decodeJwtPayload(effectiveToken);
        if (payload?.sub != null && payload.sub !== '') {
          const subStr = String(payload.sub);
          const normalizedRole = normalizeRole(payload.role) ?? payload.role;
          const baseUser = {
            id: subStr,
            email: payload.email ?? subStr,
            name: payload.name ?? payload.email ?? subStr,
            role: normalizedRole,
          };
          if (!user) {
            dispatch(setCredentials({ user: baseUser, token: effectiveToken }));
            return;
          }
          const needsRole = (user.role == null || user.role === '') && payload.role != null && payload.role !== '';
          if (needsRole) {
            const normalizedRole = normalizeRole(payload.role) ?? payload.role;
            dispatch(setCredentials({ user: { ...user, role: normalizedRole }, token: token ?? effectiveToken }));
            return;
          }
        }
      }
      dispatch(setAuthRestored(true));
    };

    if (tokenToUse && isTokenExpired(tokenToUse) && getStoredRefreshToken()) {
      tryRefresh().then((newToken) => {
        tokenToUse = newToken ?? tokenToUse;
        doRestore(tokenToUse);
      });
      return;
    }
    if (!tokenToUse && getStoredRefreshToken()) {
      tryRefresh().then((newToken) => doRestore(newToken));
      return;
    }
    doRestore(tokenToUse);
  }, [authRestored, dispatch, token, user]);

  return null;
}
