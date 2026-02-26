/**
 * Servicio de log de flujo solo en desarrollo.
 * Registra navegación, peticiones API, envíos de formularios y acciones para que
 * una IA pueda usar el contexto (copiar consola o getFlowLogAsContext()) para escribir tests o reproducir flujos.
 * En producción no hace nada.
 */

import type { FlowLogEntry, FlowLogKind } from './types';

const MAX_ENTRIES = 500;
const buffer: FlowLogEntry[] = [];

function isDev(): boolean {
  if (typeof process === 'undefined') return false;
  return process.env.NODE_ENV === 'development';
}

function ts(): string {
  return new Date().toISOString();
}

function push(entry: FlowLogEntry): void {
  if (!isDev()) return;
  buffer.push(entry);
  if (buffer.length > MAX_ENTRIES) buffer.shift();
  const prefix = `[flow:${entry.kind}]`;
  console.log(prefix, entry.ts, entry);
}

export function logFlow(kind: FlowLogKind, payload: Record<string, unknown>): void {
  const entry: FlowLogEntry = {
    t: Date.now(),
    ts: ts(),
    kind,
    ...payload,
  };
  push(entry);
}

export function logNavigation(pathname: string, search?: string): void {
  logFlow('navigation', { pathname, search: search ?? '' });
}

export function logApiRequest(method: string, url: string, body?: unknown): void {
  logFlow('api_request', {
    method,
    url,
    ...(body !== undefined && { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  });
}

export function logApiResponse(method: string, url: string, status: number, ok: boolean): void {
  logFlow('api_response', { method, url, status, ok });
}

export function logApiError(method: string, url: string, status: number, message: string): void {
  logFlow('api_error', { method, url, status, message });
}

export function logFormSubmit(formName: string, action?: string, values?: Record<string, unknown>): void {
  logFlow('form_submit', {
    formName,
    ...(action && { action }),
    ...(values && { values: JSON.stringify(values) }),
  });
}

export function logUserAction(action: string, target?: string, detail?: Record<string, unknown>): void {
  logFlow('user_action', { action, ...(target && { target }), ...(detail && detail) });
}

export function logError(message: string, error?: unknown): void {
  logFlow('error', {
    message,
    ...(error instanceof Error && { stack: error.stack, name: error.name }),
  });
}

export function getFlowLog(): FlowLogEntry[] {
  return [...buffer];
}

export function clearFlowLog(): void {
  buffer.length = 0;
}

/**
 * Devuelve el log de flujo formateado como texto para pegar como contexto a una IA
 * (por ejemplo: "flujo correcto" o "flujo con fallo en X").
 */
export function getFlowLogAsContext(opts?: { markdown?: boolean }): string {
  const entries = getFlowLog();
  if (opts?.markdown) {
    const lines = ['# Flujo de sesión (dev)', '', '```json', JSON.stringify(entries, null, 2), '```'];
    return lines.join('\n');
  }
  return JSON.stringify(entries, null, 2);
}

/**
 * En dev, expone en window.__flowLog para que desde consola puedas:
 * - __flowLog.get() → array de entradas
 * - __flowLog.copy() → copia getFlowLogAsContext() al portapapeles
 * - __flowLog.clear() → vacía el buffer
 */
export function exposeFlowLogOnWindow(): void {
  if (!isDev() || typeof window === 'undefined') return;
  (window as unknown as { __flowLog?: unknown }).__flowLog = {
    get: getFlowLog,
    copy: () => {
      const text = getFlowLogAsContext({ markdown: true });
      void navigator.clipboard.writeText(text);
      console.log('[flow] Contexto copiado al portapapeles. Pégalo donde la IA pueda leerlo.');
    },
    clear: clearFlowLog,
    asContext: getFlowLogAsContext,
  };
}
