/**
 * @biosstel/api-empresa - Empresa Management Use Case
 * Devuelve departamentos y centros de trabajo desde BD; cuentas contables (placeholder).
 */

import { Injectable, Inject } from '@nestjs/common';
import type { EmpresaListResponse } from '@biosstel/shared-types';
import { DEPARTMENT_REPOSITORY } from '../../../domain/repositories';
import type { IDepartmentRepository } from '../../../domain/repositories';
import type { TypeOrmWorkCenterRepository } from '../../../infrastructure/persistence';
import type { Department } from '../../../domain/entities/Department';

@Injectable()
export class EmpresaManagementUseCase {
  constructor(
    @Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository,
    private readonly workCenterRepo: TypeOrmWorkCenterRepository,
  ) {}

  async list(): Promise<EmpresaListResponse> {
    const [departments, centros] = await Promise.all([
      this.departmentRepo.findAll(),
      this.workCenterRepo.findAll(),
    ]);
    const departamentos = departments.map((d: Department) => d.toPlain());
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
