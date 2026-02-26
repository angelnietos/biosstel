import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { Task as FichajeTask } from '../../../../../domain/entities';
import { GetTaskByIdQuery } from '../../../queries/task/GetTaskById.query';
import { type ITaskRepository, I_TASK_REPOSITORY } from '../../../../../domain/repositories';

@QueryHandler(GetTaskByIdQuery)
@Injectable()
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(@Inject(I_TASK_REPOSITORY) private readonly taskRepo: ITaskRepository) {}

  async execute(query: GetTaskByIdQuery): Promise<FichajeTask> {
    const task = await this.taskRepo.findById(query.taskId);
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return task;
  }
}
