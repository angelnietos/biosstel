/**
 * @biosstel/auth - Auth services (HTTP calls)
 * Incluye refresh token y caducidad del access token.
 */

import type { LoginCredentials, AuthResponse } from './models';
import { API_BASE_URL, normalizeRole } from '@biosstel/platform';

const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRES_AT_KEY = 'token_expires_at';

export function getStoredRefreshToken(): string | null {
  if (typeof globalThis.window === 'undefined') return null;
  return globalThis.window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearRefreshToken(): void {
  if (typeof globalThis.window !== 'undefined') {
    globalThis.window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    globalThis.window.localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  }
}

/**
 * Guarda access token, refresh token y hora de caducidad del access token.
 */
function saveAuthToStorage(token: string, refreshToken?: string | null, expiresIn?: number): void {
  if (typeof globalThis.window === 'undefined') return;
  globalThis.window.localStorage.setItem('token', token);
  if (refreshToken) {
    globalThis.window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  if (expiresIn != null && expiresIn > 0) {
    const expiresAt = Date.now() + expiresIn * 1000;
    globalThis.window.localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: credentials.email, password: credentials.password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.message ||
      (response.status !== 401
        ? 'Error al conectar con el servidor'
        : 'Usuario o contraseña incorrectos');
    throw new Error(message);
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token ?? null;
  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : undefined;
  const rawRole = data.user?.role ?? '';
  const user = data.user
    ? {
        id: data.user.id != null ? String(data.user.id) : '',
        email: data.user.email ?? '',
        name: data.user.name ?? data.user.email ?? '',
        role: (normalizeRole(rawRole) ?? rawRole) || '',
      }
    : undefined;

  saveAuthToStorage(accessToken, refreshToken, expiresIn);

  return {
    user,
    token: accessToken,
    refreshToken: refreshToken ?? undefined,
    expiresIn,
  };
}

/**
 * Intercambia el refresh_token guardado por un nuevo access_token.
 * Actualiza token y expires_at en localStorage.
 * @returns Nuevo access token y expiresIn, o null si no hay refresh token o falla.
 */
export async function refreshAuth(): Promise<{ token: string; expiresIn: number } | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    clearRefreshToken();
    return null;
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 900;
  if (accessToken) {
    saveAuthToStorage(accessToken, refreshToken, expiresIn);
    return { token: accessToken, expiresIn };
  }
  return null;
}

export async function forgotPassword(email: string): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}
