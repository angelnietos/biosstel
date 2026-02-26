import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { DepartmentPlain } from '../../../../../domain/entities/Department';
import { DEPARTMENT_REPOSITORY } from '../../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../../domain/repositories';
import { UpdateDepartmentCommand } from '../../../commands/departments/UpdateDepartment.command';

@CommandHandler(UpdateDepartmentCommand)
@Injectable()
export class UpdateDepartmentHandler implements ICommandHandler<UpdateDepartmentCommand> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async execute(command: UpdateDepartmentCommand): Promise<DepartmentPlain> {
    const department = await this.departmentRepo.update(command.id, command.data);
    return department.toPlain();
  }
}
