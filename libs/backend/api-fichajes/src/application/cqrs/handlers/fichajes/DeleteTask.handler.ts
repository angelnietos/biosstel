import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { DeleteTaskCommand } from '../../commands/fichajes/DeleteTask.command';
import { ITaskRepository } from '../../../../domain/repositories';

@Injectable()
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand, void> {
  constructor(@Inject(ITaskRepository) private readonly taskRepo: ITaskRepository) {}

  async handle(command: DeleteTaskCommand): Promise<void> {
    const task = await this.taskRepo.findById(command.taskId);
    if (!task) throw new NotFoundException(`Task ${command.taskId} not found`);
    await this.taskRepo.delete(command.taskId);
  }
}
