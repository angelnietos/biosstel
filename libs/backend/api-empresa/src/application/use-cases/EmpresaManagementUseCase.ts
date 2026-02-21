/**
 * @biosstel/api-empresa - Empresa Management Use Case
 * Devuelve departamentos y centros de trabajo desde BD; cuentas contables (placeholder).
 */

import { Injectable } from '@nestjs/common';
import type { EmpresaListResponse } from '@biosstel/shared-types';
import { TypeOrmDepartmentRepository } from '../../infrastructure/persistence/TypeOrmDepartmentRepository';
import { TypeOrmWorkCenterRepository } from '../../infrastructure/persistence/TypeOrmWorkCenterRepository';

@Injectable()
export class EmpresaManagementUseCase {
  constructor(
    private readonly departmentRepo: TypeOrmDepartmentRepository,
    private readonly workCenterRepo: TypeOrmWorkCenterRepository,
  ) {}

  async list(): Promise<EmpresaListResponse> {
    const [departamentos, centros] = await Promise.all([
      this.departmentRepo.findAll(),
      this.workCenterRepo.findAll(),
    ]);
    return {
      departamentos,
      centros,
      cuentas: [
        { id: '1', code: '430001', description: 'Clientes España' },
        { id: '2', code: '570001', description: 'Caja euros' },
        { id: '3', code: '400001', description: 'Proveedores' },
      ],
    };
  }
}
