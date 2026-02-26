import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { CreateTaskCommand } from '../../commands/fichajes/CreateTask.command';
import type { FichajeTask } from '@biosstel/shared-types';
import { ITaskRepository } from '../../../../domain/repositories';

@Injectable()
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand, FichajeTask> {
  constructor(@Inject(ITaskRepository) private readonly taskRepo: ITaskRepository) {}

  async handle(command: CreateTaskCommand): Promise<FichajeTask> {
    if (!command.userId || typeof command.userId !== 'string' || !command.userId.trim()) {
      throw new BadRequestException('userId es obligatorio');
    }
    if (!command.title || typeof command.title !== 'string' || !command.title.trim()) {
      throw new BadRequestException('title es obligatorio');
    }
    try {
      return await this.taskRepo.create({
        userId: command.userId,
        title: command.title,
        description: command.description,
        startTime: new Date(),
        completed: false,
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === '23503') {
        throw new BadRequestException('Usuario no encontrado.');
      }
      throw err;
    }
  }
}
