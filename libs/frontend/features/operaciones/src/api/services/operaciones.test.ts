/**
 * @biosstel/operaciones - Unit tests: operaciones service with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getOperaciones } from './operaciones';

describe('operaciones service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getOperaciones calls GET /operaciones', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0 }),
    });
    const result = await getOperaciones();
    expect(result).toEqual({ items: [], total: 0 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/operaciones'),
      expect.objectContaining({ method: 'GET' })
    );
  });
});
