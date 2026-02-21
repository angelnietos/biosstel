/**
 * @biosstel/alertas - Unit tests: alertas service (getAlertas) with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getAlertas } from './alertas';

describe('alertas service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getAlertas calls GET /alertas without query when no args', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    await getAlertas();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/alertas'),
      expect.objectContaining({ method: 'GET' })
    );
    const url = (fetch as any).mock.calls[0][0];
    expect(url).not.toMatch(/\?/);
  });

  it('getAlertas adds tipo and filters to query', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    await getAlertas('ventas', {
      departamento: ['Comercial'],
      centroTrabajo: ['Centro 1'],
    });
    const url = (fetch as any).mock.calls[0][0];
    expect(url).toMatch(/tipo=ventas/);
    expect(url).toMatch(/departamento=Comercial/);
    expect(url).toMatch(/centroTrabajo=Centro/); // space encoded as + or %20
  });
});
