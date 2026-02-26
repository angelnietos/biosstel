import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { UpdateTaskCommand } from '../../commands/fichajes/UpdateTask.command';
import type { FichajeTask } from '@biosstel/shared-types';
import { ITaskRepository } from '../../../../domain/repositories';

@Injectable()
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand, FichajeTask> {
  constructor(@Inject(ITaskRepository) private readonly taskRepo: ITaskRepository) {}

  async handle(command: UpdateTaskCommand): Promise<FichajeTask> {
    const task = await this.taskRepo.findById(command.taskId);
    if (!task) throw new NotFoundException(`Task ${command.taskId} not found`);
    return this.taskRepo.save({
      ...task,
      ...command.data,
    });
  }
}
