import type { EmpresaListResponse } from '@biosstel/shared-types';

/**
 * @biosstel/api-empresa - Application Layer: Input Port
 */
export interface IEmpresaManagement {
  list(): Promise<EmpresaListResponse>;
}
