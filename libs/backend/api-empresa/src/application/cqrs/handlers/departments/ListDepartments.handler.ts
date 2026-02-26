import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { DepartmentPlain } from '../../../../domain/entities/Department';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../domain/repositories';
import type { ListDepartmentsQuery } from '../../queries/departments/ListDepartments.query';

@Injectable()
export class ListDepartmentsHandler implements IQueryHandler<ListDepartmentsQuery, DepartmentPlain[]> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async handle(query: ListDepartmentsQuery): Promise<DepartmentPlain[]> {
    const list = await this.departmentRepo.findAll(query.activeOnly);
    return list.map((d) => d.toPlain());
  }
}
