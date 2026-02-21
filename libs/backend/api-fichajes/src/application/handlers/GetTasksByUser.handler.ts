import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { FichajeTask } from '@biosstel/shared-types';
import { GetTasksByUserQuery } from '../queries/GetTasksByUser.query';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

@Injectable()
export class GetTasksByUserHandler
  implements IQueryHandler<GetTasksByUserQuery, FichajeTask[]>
{
  constructor(@Inject(ITaskRepository) private readonly taskRepo: ITaskRepository) {}

  async handle(query: GetTasksByUserQuery): Promise<FichajeTask[]> {
    if (!query.userId || typeof query.userId !== 'string' || !query.userId.trim()) {
      return [];
    }
    return this.taskRepo.findByUserId(query.userId);
  }
}
