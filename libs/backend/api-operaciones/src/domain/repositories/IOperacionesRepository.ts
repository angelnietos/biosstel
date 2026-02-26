import type { OperacionesListResponse } from '@biosstel/shared-types';

export const I_OPERACIONES_REPOSITORY = Symbol('IOperacionesRepository');

export interface IOperacionesRepository {
  getOperaciones(): Promise<OperacionesListResponse>;
}
