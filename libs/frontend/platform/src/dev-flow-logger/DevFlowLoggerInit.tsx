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

function parseErrorPayload(text: string, statusText: string): string {
  try {
    const msg = JSON.parse(text)?.message ?? text?.slice(0, 200) ?? statusText;
    return msg;
  } catch {
    return statusText || text?.slice(0, 200);
  }
}

function logFailedResponse(method: string, url: string, response: Response): void {
  response
    .clone()
    .text()
    .then((text) => logApiError(method, url, response.status, parseErrorPayload(text, response.statusText)))
    .catch(() => logApiError(method, url, response.status, response.statusText || ''));
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
          if (!response.ok) logFailedResponse(method, url, response);
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
