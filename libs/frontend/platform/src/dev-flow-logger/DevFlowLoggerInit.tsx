'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '../routing';
import {
  logNavigation,
  logApiRequest,
  logApiResponse,
  logApiError,
  exposeFlowLogOnWindow,
} from './index';

function isDev(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
}

/**
 * Inicializa el log de flujo en dev: parchea fetch, registra navegación y expone __flowLog en window.
 * Incluir una sola vez en el layout raíz (client).
 */
export function DevFlowLoggerInit() {
  const pathname = usePathname();
  const pathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isDev()) return;
    logNavigation(pathname ?? window.location.pathname);
    pathnameRef.current = pathname ?? null;
  }, [pathname]);

  useEffect(() => {
    if (!isDev() || typeof window === 'undefined') return;
    exposeFlowLogOnWindow();

    const originalFetch = window.fetch;
    window.fetch = function (...args: Parameters<typeof fetch>) {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : (input as URL).href;
      const method = (init?.method ?? 'GET') as string;
      const body = init?.body;

      logApiRequest(method, url, body ?? undefined);

      return originalFetch.apply(this, args).then(
        (response) => {
          logApiResponse(method, url, response.status, response.ok);
          if (!response.ok) {
            response.clone().text().then((text) => {
              try {
                const msg = JSON.parse(text)?.message ?? text?.slice(0, 200) ?? response.statusText;
                logApiError(method, url, response.status, msg);
              } catch {
                logApiError(method, url, response.status, response.statusText || text?.slice(0, 200));
              }
            }).catch(() => logApiError(method, url, response.status, response.statusText || ''));
          }
          return response;
        },
        (err) => {
          logApiError(method, url, 0, err?.message ?? String(err));
          throw err;
        }
      );
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
