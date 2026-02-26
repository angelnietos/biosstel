/**
 * @biosstel/fichajes - Unit tests: fichajes service (clockIn, getCurrentFichaje) with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { fichajesService } from './fichajes';

describe('fichajesService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('window', {
      localStorage: { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() },
    });
  });

  describe('clockIn', () => {
    it('throws when userId is empty', async () => {
      await expect(
        fichajesService.clockIn({ userId: '', location: undefined })
      ).rejects.toThrow('userId es obligatorio');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('throws when userId is undefined (no request sent)', async () => {
      await expect(
        fichajesService.clockIn({ userId: undefined as unknown as string, location: undefined })
      ).rejects.toThrow('userId es obligatorio');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('sends POST body with userId and location when provided', async () => {
      const mockFichaje = {
        id: 'f-1',
        userId: 'user-uuid',
        date: '2026-02-18',
        startTime: '2026-02-18T09:00:00.000Z',
        status: 'working',
        pauses: [],
      };
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockFichaje),
      });

      const result = await fichajesService.clockIn({
        userId: 'user-uuid',
        location: { lat: 40.41, lng: -3.70 },
      });

      expect(result).toEqual(mockFichaje);
      const [url, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toContain('/fichajes/clock-in');
      expect(options?.method).toBe('POST');
      const body = JSON.parse(options?.body as string);
      expect(body).toHaveProperty('userId', 'user-uuid');
      expect(body).toHaveProperty('location', { lat: 40.41, lng: -3.70 });
    });
  });

  describe('getCurrentFichaje', () => {
    it('returns null on 404', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        status: 404,
        ok: false,
      });
      const result = await fichajesService.getCurrentFichaje('user-1');
      expect(result).toBeNull();
    });
  });
});
