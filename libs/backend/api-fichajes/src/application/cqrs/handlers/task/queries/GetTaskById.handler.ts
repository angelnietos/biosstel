import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { Task as FichajeTask } from '../../../../../domain/entities';
import type { GetTaskByIdQuery } from '../../../queries/task/GetTaskById.query';
import { type ITaskRepository, I_TASK_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class GetTaskByIdHandler
  implements IQueryHandler<GetTaskByIdQuery, FichajeTask>
{
  constructor(@Inject(I_TASK_REPOSITORY) private readonly taskRepo: ITaskRepository) {}

  async handle(query: GetTaskByIdQuery): Promise<FichajeTask> {
    const task = await this.taskRepo.findById(query.taskId);
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return task;
  }
}
