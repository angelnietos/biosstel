'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@biosstel/ui';
import { Link } from '@biosstel/platform';
import { fetchTasks, isValidUserId } from '../../../data-access';
import type { FichajesState, Tarea } from '../../../data-access';
import type { TareasPaths } from './types';
import { DEFAULT_TAREAS_PATHS } from './types';

export interface PendingTasksPageProps {
  paths?: Partial<TareasPaths>;
}

export function PendingTasksPage({ paths: pathsProp }: PendingTasksPageProps = {}) {
  const paths = { ...DEFAULT_TAREAS_PATHS, ...pathsProp };
  const dispatch = useDispatch<any>();
  const authUserId = useSelector((state: {auth?: {user?: {id?: string} | null}}) => state.auth?.user?.id);
  const userId = isValidUserId(authUserId) ? authUserId : undefined;
  const { tasks, status, error } = useSelector((state: {fichajes: FichajesState}) => state.fichajes);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, userId]);

  const pendingTasks = (tasks || []).filter((t: Tarea) => !t.completed);

  if (!mounted) {
    return (
      <div className="max-w-[1180px]">
        <div className="flex items-center gap-4 mb-4">
          <Link href={paths.home} className="text-mid font-medium text-gray-600 hover:text-black">
            ← Volver
          </Link>
          <h1 className="text-h1 font-bold text-gray-900">Tareas pendientes</h1>
        </div>
        <Card className="rounded-2xl px-6 py-5">
          <div className="h-5 w-48 animate-pulse rounded bg-gray-100" />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1180px]">
      <div className="flex items-center gap-4 mb-4">
        <Link href={paths.home} className="text-mid font-medium text-gray-600 hover:text-black">
          ← Volver
        </Link>
        <h1 className="text-h1 font-bold text-gray-900">Tareas pendientes</h1>
      </div>

      {!userId && (
        <Card className="rounded-2xl px-6 py-5">
          <p className="text-mid text-gray-600">Inicia sesión para ver tus tareas.</p>
        </Card>
      )}

      {userId && status === 'loading' && (
        <Card className="rounded-2xl px-6 py-5">
          <p className="text-mid text-gray-600">Cargando tareas...</p>
        </Card>
      )}

      {userId && error && (
        <Card className="rounded-2xl px-6 py-5 border border-red-200 bg-red-50">
          <p className="text-mid text-red-700">{error}</p>
        </Card>
      )}

      {userId && status !== 'loading' && !error && (
        <Card className="rounded-2xl px-6 py-5">
          {pendingTasks.length === 0 ? (
            <p className="text-mid text-gray-600">
              No hay tareas pendientes. Puedes registrar nuevas en{' '}
              <Link href={paths.registerTasks} className="text-blue-600 hover:underline">
                Registrar tareas
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pendingTasks.map((task: Tarea) => (
                <li key={task.id} className="py-3 first:pt-0">
                  <Link
                    href={`${paths.pendingTasks}/${task.id}`}
                    className="block rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{task.title}</span>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
