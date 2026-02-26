import type { Task } from '../../entities';

export interface ITaskRepository {
  create(task: Partial<Task>): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  save(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}

export const I_TASK_REPOSITORY = Symbol('ITaskRepository');
