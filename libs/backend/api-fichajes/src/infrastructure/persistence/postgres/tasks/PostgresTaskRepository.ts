import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TaskEntity } from '../../entities/tasks/TaskEntity';
import type { ITaskRepository } from '../../../../domain/repositories/tasks/ITaskRepository';
import type { Task } from '../../../../domain/entities/task/Task';

@Injectable()
export class PostgresTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: Repository<TaskEntity>
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const entity = this.repo.create(task as Partial<TaskEntity>);
    const saved = await this.repo.save(entity);
    return saved as unknown as Task;
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity as unknown as Task | null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const entities = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities as unknown as Task[];
  }

  async save(task: Task): Promise<Task> {
    const saved = await this.repo.save(task as unknown as TaskEntity);
    return saved as unknown as Task;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
