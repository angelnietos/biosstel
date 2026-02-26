'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Input } from '@biosstel/ui';
import { Link } from '@biosstel/platform';
import { addTask, isValidUserId } from '../../../data-access';
import type { FichajesState } from '../../../data-access';
import type { TareasPaths } from './types';
import { DEFAULT_TAREAS_PATHS } from './types';

export interface RegisterTasksPageProps {
  paths?: Partial<TareasPaths>;
}

export function RegisterTasksPage({ paths: pathsProp }: RegisterTasksPageProps = {}) {
  const paths = { ...DEFAULT_TAREAS_PATHS, ...pathsProp };
  const dispatch = useDispatch<any>();
  const authUserId = useSelector((state: {auth?: {user?: {id?: string} | null}}) => state.auth?.user?.id);
  const userId = isValidUserId(authUserId) ? authUserId : undefined;
  const { status, error } = useSelector((state: {fichajes: FichajesState}) => state.fichajes);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !title.trim()) return;
    setSuccess(false);
    try {
      await dispatch(
        addTask({ userId, title: title.trim(), description: description.trim() || undefined })
      ).unwrap();
      setTitle('');
      setDescription('');
      setSuccess(true);
    } catch {
      // error in state.fichajes.error
    }
  };

  return (
    <div className="max-w-[1180px]">
      <div className="flex items-center gap-4 mb-4">
        <Link href={paths.home} className="text-mid font-medium text-gray-600 hover:text-black">
          ← Volver
        </Link>
        <h1 className="text-h2 font-semibold text-black">Registrar tareas</h1>
      </div>

      {!userId && (
        <Card className="rounded-2xl px-6 py-5">
          <p className="text-mid text-gray-600">Inicia sesión para registrar tareas.</p>
        </Card>
      )}

      {userId && (
        <Card className="rounded-2xl px-6 py-5">
          <p className="text-mid text-gray-600 mb-4">
            Añade una nueva tarea (resultado de visita, seguimiento, etc.).
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <Input
              name="title"
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Llamada de seguimiento"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles de la tarea"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">Tarea registrada correctamente.</p>}
            <Button type="submit" variant="primaryLg" disabled={status === 'loading'}>
              {status === 'loading' ? 'Guardando...' : 'Registrar tarea'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
