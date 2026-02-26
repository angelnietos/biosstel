import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from '../../../commands/task/DeleteTask.command';
import { type ITaskRepository, I_TASK_REPOSITORY } from '../../../../../domain/repositories';

@CommandHandler(DeleteTaskCommand)
@Injectable()
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(@Inject(I_TASK_REPOSITORY) private readonly taskRepo: ITaskRepository) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const task = await this.taskRepo.findById(command.taskId);
    if (!task) throw new NotFoundException(`Task ${command.taskId} not found`);
    await this.taskRepo.delete(command.taskId);
  }
}
