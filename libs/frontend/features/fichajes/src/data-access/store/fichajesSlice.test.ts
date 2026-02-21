/**
 * @biosstel/fichajes - Unit tests: fichajes slice (reducers + async thunk result handlers)
 */
import { describe, it, expect } from 'vitest';
import fichajesReducer, { clearError, clearSelectedTask } from './fichajesSlice';
import {
  clockIn,
  clockOut,
  fetchCurrentFichaje,
  fetchTasks,
  fetchTaskById,
  addTask,
  deleteTask,
} from './fichajesSlice';
import type { Fichaje, Tarea } from '../../../api/services/models';

const mockFichaje: Fichaje = {
  id: 'fichaje-1',
  userId: 'user-1',
  date: '2026-02-18',
  startTime: '2026-02-18T09:00:00.000Z',
  status: 'working',
  pauses: [],
};

const mockTarea: Tarea = {
  id: 'task-1',
  title: 'Revisar docs',
  startTime: '2026-02-18T09:00:00.000Z',
  completed: false,
};

describe('fichajesSlice', () => {
  it('initial state', () => {
    const state = fichajesReducer(undefined, { type: 'unknown' });
    expect(state.currentFichaje).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.tasks).toEqual([]);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });

  it('clockIn.pending sets status loading', () => {
    const state = fichajesReducer(
      undefined,
      clockIn.pending('requestId', { userId: 'u1', location: undefined })
    );
    expect(state.status).toBe('loading');
  });

  it('clockIn.fulfilled sets currentFichaje and idle', () => {
    const state = fichajesReducer(
      undefined,
      clockIn.fulfilled(mockFichaje, 'requestId', { userId: 'u1' })
    );
    expect(state.status).toBe('idle');
    expect(state.currentFichaje).toEqual(mockFichaje);
  });

  it('clockIn.rejected sets error and failed', () => {
    const state = fichajesReducer(
      undefined,
      clockIn.rejected(new Error('userId es obligatorio'), 'requestId', { userId: '', location: undefined })
    );
    expect(state.status).toBe('failed');
    expect(state.error).toContain('userId');
  });

  it('clockOut.fulfilled clears currentFichaje and prepends to history', () => {
    const prev = fichajesReducer(
      undefined,
      clockIn.fulfilled(mockFichaje, 'req', { userId: 'u1' })
    );
    const closed = { ...mockFichaje, endTime: '2026-02-18T18:00:00.000Z', status: 'finished' as const };
    const state = fichajesReducer(prev, clockOut.fulfilled(closed, 'req', 'fichaje-1'));
    expect(state.currentFichaje).toBeNull();
    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toEqual(closed);
  });

  it('fetchCurrentFichaje.fulfilled sets currentFichaje', () => {
    const state = fichajesReducer(
      undefined,
      fetchCurrentFichaje.fulfilled(mockFichaje, 'req', 'user-1')
    );
    expect(state.currentFichaje).toEqual(mockFichaje);
  });

  it('fetchCurrentFichaje.fulfilled with null clears currentFichaje', () => {
    const prev = fichajesReducer(
      undefined,
      fetchCurrentFichaje.fulfilled(mockFichaje, 'req', 'user-1')
    );
    const state = fichajesReducer(prev, fetchCurrentFichaje.fulfilled(null, 'req', 'user-1'));
    expect(state.currentFichaje).toBeNull();
  });

  it('fetchTasks.fulfilled sets tasks', () => {
    const state = fichajesReducer(
      undefined,
      fetchTasks.fulfilled([mockTarea], 'req', 'user-1')
    );
    expect(state.tasks).toEqual([mockTarea]);
    expect(state.status).toBe('idle');
  });

  it('addTask.fulfilled appends task', () => {
    const prev = fichajesReducer(
      undefined,
      fetchTasks.fulfilled([mockTarea], 'req', 'user-1')
    );
    const newTask = { ...mockTarea, id: 'task-2', title: 'Nueva' };
    const state = fichajesReducer(
      prev,
      addTask.fulfilled(newTask, 'req', { userId: 'u1', title: 'Nueva' })
    );
    expect(state.tasks).toHaveLength(2);
    expect(state.tasks[1].title).toBe('Nueva');
  });

  it('deleteTask.fulfilled removes task', () => {
    const prev = fichajesReducer(
      undefined,
      fetchTasks.fulfilled([mockTarea], 'req', 'user-1')
    );
    const state = fichajesReducer(prev, deleteTask.fulfilled('task-1', 'req', 'task-1'));
    expect(state.tasks).toHaveLength(0);
  });

  it('clearError clears error', () => {
    const prev = fichajesReducer(
      undefined,
      clockIn.rejected(new Error('Error'), 'req', { userId: 'u', location: undefined })
    );
    const state = fichajesReducer(prev, clearError());
    expect(state.error).toBeNull();
  });

  it('clearSelectedTask clears selectedTask', () => {
    const prev = fichajesReducer(
      undefined,
      fetchTaskById.fulfilled(mockTarea, 'req', 'task-1')
    );
    const state = fichajesReducer(prev, clearSelectedTask());
    expect(state.selectedTask).toBeNull();
  });
});
