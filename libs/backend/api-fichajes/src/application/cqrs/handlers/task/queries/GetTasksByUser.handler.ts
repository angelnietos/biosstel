import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { Task as FichajeTask } from '../../../../../domain/entities';
import type { GetTasksByUserQuery } from '../../../queries/task/GetTasksByUser.query';
import { type ITaskRepository, I_TASK_REPOSITORY } from '../../../../../domain/repositories';

@Injectable()
export class GetTasksByUserHandler
  implements IQueryHandler<GetTasksByUserQuery, FichajeTask[]>
{
  constructor(@Inject(I_TASK_REPOSITORY) private readonly taskRepo: ITaskRepository) {}

  async handle(query: GetTasksByUserQuery): Promise<FichajeTask[]> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return [];
    }
    return this.taskRepo.findByUserId(query.userId);
  }
}
