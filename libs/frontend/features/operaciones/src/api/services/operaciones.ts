/**
 * @biosstel/operaciones - Operaciones API (visitas, agenda, revisión, tienda)
 */

import type { OperacionesListResponse } from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export async function getOperaciones(): Promise<OperacionesListResponse> {
  const res = await fetch(`${API_BASE_URL}/operaciones`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<OperacionesListResponse>(res);
}
