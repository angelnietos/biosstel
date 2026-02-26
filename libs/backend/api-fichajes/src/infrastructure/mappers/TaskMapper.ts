import type { Task } from '../../domain/entities/task/Task';
import type { TaskEntity } from '../persistence/entities/tasks/TaskEntity';

/** Maps between TaskEntity (TypeORM) and Task domain entity. */
export class TaskMapper {
  static toDomain(entity: TaskEntity): Task {
    const { Task: TaskClass } = require('../../domain/entities/task/Task');
    return new TaskClass(
      entity.id,
      entity.userId,
      entity.title,
      entity.startTime,
      entity.completed,
      entity.description,
      entity.endTime,
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toEntity(domain: Task): Partial<TaskEntity> {
    return {
      userId: domain.userId,
      title: domain.title,
      startTime: domain.startTime,
      completed: domain.completed,
      description: domain.description,
      endTime: domain.endTime,
    };
  }
}
