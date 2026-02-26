/**
 * @biosstel/api-empresa - Application Layer: Output Port
 * Top-level aggregate repository for the empresa bounded context.
 * Delegates specific entities to IDepartmentRepository and IWorkCenterRepository.
 */

import type { EmpresaListResponse } from '@biosstel/shared-types';

export interface IEmpresaRepository {
  /** Returns the full empresa list response (departments, work centers, accounts). */
  list(): Promise<EmpresaListResponse>;
}
