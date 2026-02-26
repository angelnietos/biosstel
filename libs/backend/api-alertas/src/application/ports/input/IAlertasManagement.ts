import type { DashboardAlert, PaginatedResult } from '@biosstel/shared-types';

export interface AlertasListFilters {
  departamento?: string[];
  centroTrabajo?: string[];
  marca?: string[];
}

/**
 * @biosstel/api-alertas - Application Layer: Input Port
 */
export interface IAlertasManagement {
  list(
    tipo?: 'ventas' | 'recordatorios' | 'tracking',
    filters?: AlertasListFilters,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResult<DashboardAlert>>;
}
