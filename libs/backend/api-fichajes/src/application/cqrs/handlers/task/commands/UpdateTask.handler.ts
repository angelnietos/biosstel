import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTaskCommand } from '../../../commands/task/UpdateTask.command';
import type { Task as FichajeTask } from '../../../../../domain/entities';
import { type ITaskRepository, I_TASK_REPOSITORY } from '../../../../../domain/repositories';

@CommandHandler(UpdateTaskCommand)
@Injectable()
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(@Inject(I_TASK_REPOSITORY) private readonly taskRepo: ITaskRepository) {}

  async execute(command: UpdateTaskCommand): Promise<FichajeTask> {
    const task = await this.taskRepo.findById(command.taskId);
    if (!task) throw new NotFoundException(`Task ${command.taskId} not found`);
    return this.taskRepo.save({
      ...task,
      ...command.data,
    } as FichajeTask);
  }
}
