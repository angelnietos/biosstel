import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DEPARTMENT_REPOSITORY } from '../../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../../domain/repositories';
import { DeleteDepartmentCommand } from '../../../commands/departments/DeleteDepartment.command';

@CommandHandler(DeleteDepartmentCommand)
@Injectable()
export class DeleteDepartmentHandler implements ICommandHandler<DeleteDepartmentCommand> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async execute(command: DeleteDepartmentCommand): Promise<void> {
    await this.departmentRepo.delete(command.id);
  }
}
