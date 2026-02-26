import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { DeleteTaskCommand } from '../../../commands/task/DeleteTask.command';
import { type ITaskRepository, I_TASK_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand, void> {
  constructor(@Inject(I_TASK_REPOSITORY) private readonly taskRepo: ITaskRepository) {}

  async handle(command: DeleteTaskCommand): Promise<void> {
    const task = await this.taskRepo.findById(command.taskId);
    if (!task) throw new NotFoundException(`Task ${command.taskId} not found`);
    await this.taskRepo.delete(command.taskId);
  }
}
