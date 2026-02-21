import type { OperacionesListResponse } from '@biosstel/shared-types';

/**
 * @biosstel/api-operaciones - Application Layer: Input Port
 */
export interface IOperacionesManagement {
  list(): Promise<OperacionesListResponse>;
}
