/**
 * @biosstel/auth - Unit tests: auth service (login, forgotPassword, refreshAuth) with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, forgotPassword, refreshAuth, clearRefreshToken, getStoredRefreshToken } from './auth';

describe('auth service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('window', { localStorage: { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() } });
  });

  describe('login', () => {
    it('returns user and token on 200', async () => {
      const mockRes = {
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'jwt-123',
            refresh_token: 'refresh-456',
            expires_in: 900,
            user: {
              id: 'user-id',
              email: 'admin@biosstel.com',
              role: 'admin',
            },
          }),
      };
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockRes);

      const result = await login({
        email: 'admin@biosstel.com',
        password: 'admin123',
      });

      expect(result.token).toBe('jwt-123');
      expect(result.user?.id).toBe('user-id');
      expect(result.user?.email).toBe('admin@biosstel.com');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@biosstel.com',
            password: 'admin123',
          }),
        })
      );
    });

    it('throws on 401 with server message', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Credenciales inválidas' }),
      });

      await expect(
        login({ email: 'x@x.com', password: 'wrong' })
      ).rejects.toThrow('Credenciales inválidas');
    });

    it('throws generic message on 401 without body message', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({}),
      });

      await expect(
        login({ email: 'x@x.com', password: 'wrong' })
      ).rejects.toThrow('Usuario o contraseña incorrectos');
    });

    it('normalizes user.id to string when API returns number', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'jwt',
            user: { id: 12345, email: 'n@n.com', role: 'comercial' },
          }),
      });

      const result = await login({ email: 'n@n.com', password: 'p' });
      expect(result.user?.id).toBe('12345');
    });
  });

  describe('refreshAuth', () => {
    it('returns new token and expiresIn when refresh_token is valid', async () => {
      (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('stored-refresh');
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ access_token: 'new-access', expires_in: 900 }),
      });

      const result = await refreshAuth();
      expect(result).not.toBeNull();
      expect(result?.token).toBe('new-access');
      expect(result?.expiresIn).toBe(900);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refresh_token: 'stored-refresh' }),
        })
      );
    });

    it('returns null when no refresh_token in storage', async () => {
      (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      const result = await refreshAuth();
      expect(result).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('returns null and clears storage when refresh returns 401', async () => {
      (window.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('bad');
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false });

      const result = await refreshAuth();
      expect(result).toBeNull();
      expect(window.localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('calls POST /auth/forgot-password with email', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
      });

      await forgotPassword('user@biosstel.com');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/forgot-password'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'user@biosstel.com' }),
        })
      );
    });
  });
});
