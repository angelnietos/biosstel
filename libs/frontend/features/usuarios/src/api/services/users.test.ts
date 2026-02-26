/**
 * @biosstel/usuarios - Unit tests: users service with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getUsers, createUser } from './users';

describe('users service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getUsers calls GET /users (no query when no params)', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0 }),
    });
    await getUsers();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.any(Object)
    );
    const url = (fetch as any).mock.calls[0][0];
    expect(url).toMatch(/\/users$/);
  });

  it('getUsers returns items from paginated response', async () => {
    const items = [{ id: 'u1', email: 'x@x.com', firstName: 'X', lastName: 'Y', isActive: true }];
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items, total: 1 }),
    });
    const result = await getUsers({ page: 2, pageSize: 10 });
    expect(result).toEqual(items);
  });

  it('createUser sends POST with body', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'new', email: 'n@n.com' }),
    });
    await createUser({ email: 'n@n.com', password: 'secret' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'n@n.com', password: 'secret' }),
      })
    );
  });
});
