import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { Task as FichajeTask } from '../../../../../domain/entities';
import { GetTasksByUserQuery } from '../../../queries/task/GetTasksByUser.query';
import { type ITaskRepository, I_TASK_REPOSITORY } from '../../../../../domain/repositories';

@QueryHandler(GetTasksByUserQuery)
@Injectable()
export class GetTasksByUserHandler implements IQueryHandler<GetTasksByUserQuery> {
  constructor(@Inject(I_TASK_REPOSITORY) private readonly taskRepo: ITaskRepository) {}

  async execute(query: GetTasksByUserQuery): Promise<FichajeTask[]> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return [];
    }
    return this.taskRepo.findByUserId(query.userId);
  }
}
