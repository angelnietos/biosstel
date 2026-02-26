/**
 * @biosstel/alertas - Alertas API (listado con filtros y paginación)
 */

import type { DashboardAlert } from './models';
import type { PaginatedResult } from '@biosstel/shared-types';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export type AlertaTipo = 'ventas' | 'recordatorios' | 'tracking';

export interface AlertasFilters {
  departamento?: string[];
  centroTrabajo?: string[];
  marca?: string[];
}

export interface GetAlertasParams {
  tipo?: AlertaTipo;
  filters?: AlertasFilters;
  page?: number;
  pageSize?: number;
}

/** Respuesta paginada del API (items + total). */
export type AlertasListResponse = PaginatedResult<DashboardAlert>;

export async function getAlertas(
  tipo?: AlertaTipo,
  filters?: AlertasFilters,
  page = 1,
  pageSize = 10
): Promise<AlertasListResponse> {
  const params = new URLSearchParams();
  if (tipo) params.set('tipo', tipo);
  if (filters?.departamento?.length) params.set('departamento', filters.departamento.join(','));
  if (filters?.centroTrabajo?.length) params.set('centroTrabajo', filters.centroTrabajo.join(','));
  if (filters?.marca?.length) params.set('marca', filters.marca.join(','));
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  const res = await fetch(`${API_BASE_URL}/alertas?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  const body = await handleResponse<AlertasListResponse>(res);
  let items: DashboardAlert[] = [];
  if (Array.isArray(body?.items)) {
    items = body.items;
  } else if (Array.isArray((body as { data?: DashboardAlert[] })?.data)) {
    items = (body as { data: DashboardAlert[] }).data;
  }
  const total = typeof body?.total === 'number' ? body.total : items.length;
  return { items, data: items, total, page: body?.page ?? page, pageSize: body?.pageSize ?? pageSize };
}
