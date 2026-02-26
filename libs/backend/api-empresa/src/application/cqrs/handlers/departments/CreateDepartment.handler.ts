import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { DepartmentPlain } from '../../../../domain/entities/Department';
import { DEPARTMENT_REPOSITORY } from '../../../../domain/repositories';
import type { IDepartmentRepository } from '../../../../domain/repositories';
import type { CreateDepartmentCommand } from '../../commands/departments/CreateDepartment.command';

@Injectable()
export class CreateDepartmentHandler implements ICommandHandler<CreateDepartmentCommand, DepartmentPlain> {
  constructor(@Inject(DEPARTMENT_REPOSITORY) private readonly departmentRepo: IDepartmentRepository) {}

  async handle(command: CreateDepartmentCommand): Promise<DepartmentPlain> {
    try {
      const department = await this.departmentRepo.create({
        name: command.data.name ?? '',
        code: command.data.code,
        color: command.data.color,
        responsibleUserId: command.data.responsibleUserId,
        dateFrom: command.data.dateFrom,
        dateTo: command.data.dateTo,
      });
      return department.toPlain();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear departamento';
      throw new BadRequestException(message);
    }
  }
}
