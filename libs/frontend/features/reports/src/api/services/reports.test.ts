/**
 * @biosstel/reports - Unit tests: reports service with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getReportsSummary } from './reports';

describe('reports service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getReportsSummary calls GET /reports/summary', async () => {
    const mockSummary = { totalVentas: 100, totalClientes: 5 };
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSummary),
    });
    const result = await getReportsSummary();
    expect(result).toEqual(mockSummary);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/reports/summary'),
      expect.objectContaining({ method: 'GET' })
    );
  });
});
