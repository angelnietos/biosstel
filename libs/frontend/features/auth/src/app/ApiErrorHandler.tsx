'use client';

import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { setUnauthorizedHandler, setApiErrorHandler } from '@biosstel/platform';
import { logout, setCredentials } from '../data-access/store/authSlice';
import { refreshAuth, clearRefreshToken } from '../api/services/auth';

/**
 * Registers global API interceptors: 401 → intenta refresh token; si falla, logout + redirect.
 * Mount once in app root (e.g. inside Providers).
 */
export function ApiErrorHandler() {
  const dispatch = useDispatch<any>();
  const store = useStore<any>();

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      const result = await refreshAuth();
      if (result) {
        const state = store.getState();
        dispatch(setCredentials({ user: state.auth?.user ?? null, token: result.token }));
        return;
      }
      clearRefreshToken();
      dispatch(logout());
      if (typeof globalThis.window !== 'undefined') {
        const locale = globalThis.window.location.pathname.split('/').find(Boolean) || 'es';
        globalThis.window.location.href = `/${locale}/login`;
      }
    });

    setApiErrorHandler((message, status, requestUrl) => {
      if (process.env.NODE_ENV === 'development' && status >= 400) {
        console.error('[API Error]', status, requestUrl ?? '', message);
      }
    });

    return () => {
      setUnauthorizedHandler(null);
      setApiErrorHandler(null);
    };
  }, [dispatch, store]);

  return null;
}
