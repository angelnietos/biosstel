import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository, DeepPartial } from 'typeorm';
import { TaskEntity } from '../../entities/tasks/TaskEntity';
import type { ITaskRepository } from '../../../../domain/repositories';
import type { Task } from '../../../../domain/entities/Task';
import { TaskMapper } from '../../../mappers/TaskMapper';

@Injectable()
export class PostgresTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  async create(data: Partial<Task>): Promise<Task> {
    const entity = this.repository.create(data as DeepPartial<TaskEntity>);
    const saved = await this.repository.save(entity);
    return TaskMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? TaskMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const list = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return list.map(e => TaskMapper.toDomain(e));
  }

  async save(task: Task): Promise<Task> {
    const entity = TaskMapper.toPersistence(task);
    const saved = await this.repository.save(entity);
    return TaskMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
