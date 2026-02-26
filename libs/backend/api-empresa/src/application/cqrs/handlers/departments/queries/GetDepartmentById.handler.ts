import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { DepartmentPlain } from '../../../../../domain/entities/Department';
import { DEPARTMENT_REPOSITORY } from '../../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../../domain/repositories';
import type { GetDepartmentByIdQuery } from '../../../queries/departments/GetDepartmentById.query';

@Injectable()
export class GetDepartmentByIdHandler implements IQueryHandler<GetDepartmentByIdQuery, DepartmentPlain | null> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async handle(query: GetDepartmentByIdQuery): Promise<DepartmentPlain | null> {
    const d = await this.departmentRepo.findById(query.id);
    return d ? d.toPlain() : null;
  }
}
