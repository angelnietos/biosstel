import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { FichajeTask } from '@biosstel/shared-types';
import type { GetTaskByIdQuery } from '../../queries/fichajes/GetTaskById.query';
import { ITaskRepository } from '../../../../domain/repositories';

@Injectable()
export class GetTaskByIdHandler
  implements IQueryHandler<GetTaskByIdQuery, FichajeTask>
{
  constructor(@Inject(ITaskRepository) private readonly taskRepo: ITaskRepository) {}

  async handle(query: GetTaskByIdQuery): Promise<FichajeTask> {
    const task = await this.taskRepo.findById(query.taskId);
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return task;
  }
}
