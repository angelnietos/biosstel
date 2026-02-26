/**
 * @biosstel/api-operaciones - Operaciones Management Use Case
 * Devuelve visitas, agenda, revisión y tienda (datos integrados para el front).
 */

import { Injectable, Inject } from '@nestjs/common';
import type { OperacionesListResponse } from '@biosstel/shared-types';
import type { IOperacionesRepository } from '../../repositories';
import { I_OPERACIONES_REPOSITORY } from '../../repositories';

@Injectable()
export class OperacionesManagementUseCase {
  constructor(
    @Inject(I_OPERACIONES_REPOSITORY)
    private readonly repository: IOperacionesRepository
  ) {}

  async list(): Promise<OperacionesListResponse> {
    return this.repository.getOperaciones();
  }
}
