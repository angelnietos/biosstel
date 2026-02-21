import type { ReportsSummaryResponse } from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export async function getReportsSummary(): Promise<ReportsSummaryResponse> {
  const res = await fetch(`${API_BASE_URL}/reports/summary`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<ReportsSummaryResponse>(res);
}
