import type { FichajeTask } from '@biosstel/shared-types';

export interface ITaskRepository {
  create(task: Partial<FichajeTask>): Promise<FichajeTask>;
  findById(id: string): Promise<FichajeTask | null>;
  findByUserId(userId: string): Promise<FichajeTask[]>;
  save(task: FichajeTask): Promise<FichajeTask>;
  delete(id: string): Promise<void>;
}

export const ITaskRepository = Symbol('ITaskRepository');
