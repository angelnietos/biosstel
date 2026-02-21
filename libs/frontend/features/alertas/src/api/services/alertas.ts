/**
 * @biosstel/alertas - Alertas API (listado con filtro opcional por tipo)
 */

import type { DashboardAlert } from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export type AlertaTipo = 'ventas' | 'recordatorios' | 'tracking';

export interface AlertasFilters {
  departamento?: string[];
  centroTrabajo?: string[];
}

export async function getAlertas(
  tipo?: AlertaTipo,
  filters?: AlertasFilters
): Promise<DashboardAlert[]> {
  const params = new URLSearchParams();
  if (tipo) params.set('tipo', tipo);
  if (filters?.departamento?.length) params.set('departamento', filters.departamento.join(','));
  if (filters?.centroTrabajo?.length) params.set('centroTrabajo', filters.centroTrabajo.join(','));
  const qs = params.toString();
  const res = await fetch(`${API_BASE_URL}/alertas${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<DashboardAlert[]>(res);
}
