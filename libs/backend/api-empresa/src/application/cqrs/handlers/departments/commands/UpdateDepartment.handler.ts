import { Injectable, Inject } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { DepartmentPlain } from '../../../../../domain/entities/Department';
import { DEPARTMENT_REPOSITORY } from '../../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../../domain/repositories';
import type { UpdateDepartmentCommand } from '../../../commands/departments/UpdateDepartment.command';

@Injectable()
export class UpdateDepartmentHandler implements ICommandHandler<UpdateDepartmentCommand, DepartmentPlain> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async handle(command: UpdateDepartmentCommand): Promise<DepartmentPlain> {
    const department = await this.departmentRepo.update(command.id, command.data);
    return department.toPlain();
  }
}
