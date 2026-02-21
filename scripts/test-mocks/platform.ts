/**
 * Mock de @biosstel/platform para tests (solo API).
 * Evita cargar next-intl/next en Vitest.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const API_BASE_URL = `${API_URL.replace(/\/+$/, '')}/api/v1`;

export function getAuthHeaders(): Record<string, string> {
  const token = typeof globalThis !== 'undefined' && (globalThis as any).localStorage?.getItem?.('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = (errorData as any)?.message || 'Error en la petición';
    throw new Error(message);
  }
  return response.json();
}

export function setUnauthorizedHandler(_: (() => void) | null): void {}
export function setApiErrorHandler(_: ((message: string, status: number, requestUrl?: string) => void) | null): void {}
