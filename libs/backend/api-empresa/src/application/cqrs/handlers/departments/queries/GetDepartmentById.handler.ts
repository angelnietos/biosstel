import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { DepartmentPlain } from '../../../../../domain/entities/Department';
import { DEPARTMENT_REPOSITORY } from '../../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../../domain/repositories';
import { GetDepartmentByIdQuery } from '../../../queries/departments/GetDepartmentById.query';

@QueryHandler(GetDepartmentByIdQuery)
@Injectable()
export class GetDepartmentByIdHandler implements IQueryHandler<GetDepartmentByIdQuery> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async execute(query: GetDepartmentByIdQuery): Promise<DepartmentPlain | null> {
    const d = await this.departmentRepo.findById(query.id);
    return d ? d.toPlain() : null;
  }
}
