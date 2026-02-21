import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../TaskEntity';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';

@Injectable()
export class PostgresTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  async create(task: Partial<TaskEntity>): Promise<TaskEntity> {
    const entity = this.repository.create(task);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<TaskEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<TaskEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async save(task: TaskEntity): Promise<TaskEntity> {
    return this.repository.save(task);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
