import { Injectable, Inject } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { FichajeTask } from '@biosstel/shared-types';
import type { GetTasksByUserQuery } from '../../queries/fichajes/GetTasksByUser.query';
import { ITaskRepository } from '../../../../domain/repositories';

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
