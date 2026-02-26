import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { DepartmentPlain } from '../../../../../domain/entities/Department';
import { DEPARTMENT_REPOSITORY } from '../../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../../domain/repositories';
import { ListDepartmentsQuery } from '../../../queries/departments/ListDepartments.query';

@QueryHandler(ListDepartmentsQuery)
@Injectable()
export class ListDepartmentsHandler implements IQueryHandler<ListDepartmentsQuery> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async execute(query: ListDepartmentsQuery): Promise<DepartmentPlain[]> {
    const list = await this.departmentRepo.findAll(query.activeOnly);
    return list.map((d) => d.toPlain());
  }
}
