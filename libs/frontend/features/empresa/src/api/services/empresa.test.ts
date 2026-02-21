/**
 * @biosstel/empresa - Unit tests: empresa service with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getEmpresa, createDepartment, createWorkCenter } from './empresa';

describe('empresa service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getEmpresa calls GET /empresa', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ departments: [], workCenters: [] }),
    });
    const result = await getEmpresa();
    expect(result).toEqual({ departments: [], workCenters: [] });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/empresa'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('createDepartment sends POST with body', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'd1', name: 'Comercial', color: null }),
    });
    await createDepartment({ name: 'Comercial', code: 'C01' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/empresa/departments'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Comercial', code: 'C01' }),
      })
    );
  });

  it('createWorkCenter sends POST with name and optional address', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'w1', name: 'Barakaldo', address: 'C/ Ejemplo' }),
    });
    await createWorkCenter({ name: 'Barakaldo', address: 'C/ Ejemplo' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/empresa/work-centers'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Barakaldo', address: 'C/ Ejemplo' }),
      })
    );
  });
});
