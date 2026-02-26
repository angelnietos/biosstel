import { Injectable, Inject } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../domain/repositories';
import type { DeleteDepartmentCommand } from '../../commands/departments/DeleteDepartment.command';

@Injectable()
export class DeleteDepartmentHandler implements ICommandHandler<DeleteDepartmentCommand, void> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async handle(command: DeleteDepartmentCommand): Promise<void> {
    await this.departmentRepo.delete(command.id);
  }
}
