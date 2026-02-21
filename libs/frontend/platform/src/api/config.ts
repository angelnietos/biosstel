/**
 * Centralized API configuration.
 *
 * Reads the base URL from the NEXT_PUBLIC_API_URL environment variable
 * and appends the versioned API prefix (/api/v1).
 *
 * All feature API modules should import API_BASE_URL from here
 * instead of building the URL locally.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** Full base URL including the versioned prefix, e.g. http://localhost:4000/api/v1 */
export const API_BASE_URL = `${API_URL.replace(/\/+$/, '')}/api/v1`;

/** Helper to build common request headers (with optional auth token). */
export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Callback when API returns 401. Puede ser async (ej. intentar refresh token antes de cerrar sesión). */
let onUnauthorized: (() => void | Promise<void>) | null = null;

/** Register handler for 401 responses. Call from app root (e.g. Providers). */
export function setUnauthorizedHandler(handler: (() => void | Promise<void>) | null): void {
  onUnauthorized = handler;
}

/** Optional: callback for any API error (message, status, requestUrl for debugging). */
let onApiError: ((message: string, status: number, requestUrl?: string) => void) | null = null;

/** Register global API error handler. */
export function setApiErrorHandler(
  handler: ((message: string, status: number, requestUrl?: string) => void) | null
): void {
  onApiError = handler;
}

/** Generic response handler – throws with the server message on error. Calls 401 handler when set (await if async). */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = (errorData?.message as string) || 'Error en la petición';
    if (response.status === 401 && onUnauthorized) {
      await Promise.resolve(onUnauthorized());
    }
    if (onApiError) {
      onApiError(message, response.status, response.url);
    }
    throw new Error(message);
  }
  return response.json();
}
