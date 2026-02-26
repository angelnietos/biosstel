'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, ConfirmModal } from '@biosstel/ui';
import { Link } from '@biosstel/platform';
import {
  fetchTaskById,
  completeTask,
  deleteTask,
  clearSelectedTask,
} from '../../../data-access';
import type { FichajesState, Tarea } from '../../../data-access';
import type { TareasPaths } from './types';
import { DEFAULT_TAREAS_PATHS } from './types';

export interface PendingTaskDetailPageProps {
  taskId: string;
  paths?: Partial<TareasPaths>;
}

export function PendingTaskDetailPage({ taskId, paths: pathsProp }: Readonly<PendingTaskDetailPageProps>) {
  const paths = { ...DEFAULT_TAREAS_PATHS, ...pathsProp };
  const id = taskId;
  const dispatch = useDispatch<any>();
  const { selectedTask, tasks, status, error } = useSelector(
    (state: any) => state.fichajes as FichajesState
  );

  const task = selectedTask ?? (tasks || []).find((t: Tarea) => t.id === id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskById(id));
    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch, id]);

  const handleComplete = () => {
    dispatch(completeTask({ id, completed: true }));
  };

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleConfirmDelete = () => {
    dispatch(deleteTask(id));
    setShowDeleteModal(false);
    globalThis.window.history.back();
  };

  if (status === 'loading' && !task) {
    return (
      <div className="max-w-[1180px]">
        <p className="text-mid text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="max-w-[1180px]">
        <Card className="rounded-2xl px-6 py-5 border border-red-200 bg-red-50">
          <p className="text-mid text-red-700">{error}</p>
          <Link href={paths.pendingTasks} className="mt-2 inline-block text-blue-600 hover:underline">
            ← Volver a tareas pendientes
          </Link>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-[1180px]">
        <Card className="rounded-2xl px-6 py-5">
          <p className="text-mid text-gray-600">Tarea no encontrada.</p>
          <Link href={paths.pendingTasks} className="mt-2 inline-block text-blue-600 hover:underline">
            ← Volver a tareas pendientes
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1180px]">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Link href={paths.pendingTasks} className="text-mid font-medium text-gray-600 hover:text-black">
            ← Volver
          </Link>
          <h1 className="text-h2 font-medium text-black">{task.title}</h1>
        </div>
        <div className="flex gap-2">
          {!task.completed && (
            <Button variant="primaryLg" onClick={handleComplete} disabled={status === 'loading'}>
              Marcar como hecha
            </Button>
          )}
          <Button variant="cancelLg" onClick={handleDeleteClick} disabled={status === 'loading'}>
            Eliminar
          </Button>
        </div>
      </div>
      <Card className="rounded-2xl px-6 py-5">
        {task.completed && (
          <p className="text-sm text-green-600 font-medium mb-2">Completada</p>
        )}
        {task.description && (
          <p className="text-mid text-gray-700 whitespace-pre-wrap">{task.description}</p>
        )}
        {!task.description && (
          <p className="text-mid text-gray-500">Sin descripción.</p>
        )}
      </Card>

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar tarea"
        description={task ? `¿Eliminar la tarea "${task.title}"?` : ''}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
