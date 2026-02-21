import type { DashboardAlert } from '@biosstel/shared-types';

/**
 * @biosstel/api-alertas - Application Layer: Input Port
 */
export interface IAlertasManagement {
  list(tipo?: 'ventas' | 'recordatorios' | 'tracking'): Promise<DashboardAlert[]>;
}
