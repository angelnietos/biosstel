import { Task } from '../../domain/entities/Task';
import { TaskEntity } from '../persistence/entities/fichajes/TaskEntity';

export class TaskMapper {
  public static toDomain(entity: TaskEntity): Task {
    return new Task(
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

  public static toPersistence(domain: Task): TaskEntity {
    const entity = new TaskEntity();
    if (domain.id) entity.id = domain.id;
    entity.userId = domain.userId;
    entity.title = domain.title;
    entity.startTime = domain.startTime;
    entity.completed = domain.completed;
    entity.description = domain.description;
    entity.endTime = domain.endTime;
    return entity;
  }
}
