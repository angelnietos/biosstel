/**
 * @biosstel/fichajes - ControlJornada
 * Botones de entrada, pausa, retomar y salida; tareas del día e historial de fichajes.
 */

'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FichajesPageLayout } from '../../layouts';
import { Input, ConfirmModal, ClockArc, Heading, Text } from '@biosstel/ui';
import { 
  clockIn, 
  clockOut, 
  pauseWork, 
  resumeWork, 
  addTask, 
  completeTask,
  deleteTask,
  fetchFichajes,
  fetchTasks,
  fetchCurrentFichaje,
  clearError
} from '../../..';
import type { FichajesState, Tarea } from '../../../data-access';
import { HistorialFichajes } from '../HistorialFichajes';
import { isValidUserId } from '../../../data-access';
import { Stack } from '@biosstel/ui-layout';
import { useRouter, useLocale, logUserAction } from '@biosstel/platform';
import { useCanFichar } from '@biosstel/shared';

export const ControlJornada = () => {
  const dispatch = useDispatch<any>(); // Typed dispatch for thunks
  const router = useRouter();
  const locale = useLocale();
  const { currentFichaje, tasks, status, error } = useSelector((state: any) => state.fichajes as FichajesState);
  const authRestored = useSelector((state: any) => state.auth?.authRestored);
  const authUser = useSelector((state: any) => (state.auth as { user?: { id?: string; role?: string } })?.user);
  const authUserId = authUser?.id;
  const userId = isValidUserId(authUserId) ? authUserId : undefined;
  const canFichar = useCanFichar();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<Tarea | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirigir sin mostrar esta página: sin sesión → login; admin/coordinador → listado fichajes.
  useEffect(() => {
    if (!mounted || !authRestored) return;
    if (!authUser) {
      window.location.replace(`/${locale}/login`);
      return;
    }
    if (!canFichar) {
      window.location.replace(`/${locale}/fichajes`);
    }
  }, [mounted, authRestored, authUser, canFichar, locale]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCurrentFichaje(userId));
      dispatch(fetchFichajes(userId));
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, userId]);

  const handleClockIn = () => {
    if (userId) {
      logUserAction('fichajes_clock_in');
      dispatch(clockIn({ userId, location: { lat: 40.4168, lng: -3.7038 } }));
    }
  };

  const handleClockOut = () => {
    if (currentFichaje) {
      logUserAction('fichajes_clock_out');
      dispatch(clockOut(currentFichaje.id));
    }
  };

  const handlePause = () => {
    if (currentFichaje) {
      logUserAction('fichajes_pause');
      dispatch(pauseWork({ id: currentFichaje.id, reason: 'Descanso' }));
    }
  };

  const handleResume = () => {
    if (currentFichaje) {
      logUserAction('fichajes_resume');
      dispatch(resumeWork(currentFichaje.id));
    }
  };

  const handleAddTask = () => {
    if (userId && newTaskTitle.trim()) {
      logUserAction('fichajes_add_task', undefined, { title: newTaskTitle });
      dispatch(addTask({ userId, title: newTaskTitle }));
      setNewTaskTitle('');
    }
  };

  const handleToggleTask = (task: Tarea) => {
    logUserAction('fichajes_toggle_task', undefined, { taskId: task.id, completed: !task.completed });
    dispatch(completeTask({ id: task.id, completed: !task.completed }));
  };

  const handleConfirmDeleteTask = () => {
    if (taskToDelete) {
      logUserAction('fichajes_delete_task', undefined, { taskId: taskToDelete.id });
      dispatch(deleteTask(taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const fichajeStatus = currentFichaje?.status || 'idle';
  const isLoading = status === 'loading';

  // Figma Base-15: "Ficho mal fuera de horario" cuando la API indique fueraHorario
  const fueraHorario = (currentFichaje as { fueraHorario?: boolean } | undefined)?.fueraHorario === true;
  const arcVariant =
    fichajeStatus === 'working'
      ? fueraHorario
        ? 'red'
        : 'green'
      : fichajeStatus === 'paused'
        ? 'red'
        : 'gray';
  const arcProgress = fichajeStatus === 'working' ? 50 : fichajeStatus === 'paused' ? 25 : 0;
  const statusMessage =
    fichajeStatus === 'working'
      ? fueraHorario
        ? "Ficho 'mal' fuera de su horario"
        : 'Ficho bien dentro de su horario'
      : fichajeStatus === 'paused'
        ? 'Jornada pausada'
        : fichajeStatus === 'finished'
          ? 'Jornada finalizada'
          : null;

  // No mostrar nada de esta ruta hasta saber si redirigir o mostrar el formulario.
  // Así no se pinta "Gestión de jornada" ni ningún mensaje mientras carga/auth.
  if (!mounted || !authRestored) {
    return null;
  }

  if (!authUser || !canFichar) {
    return null;
  }

  return (
    <FichajesPageLayout title="Gestión de jornada">
      <Stack gap={6}>
        {/* Fichaje Controls Card */}
        <div className="bg-white rounded-2xl border border-border-card shadow-sm p-10 flex flex-col items-center">
          {!userId && (
            <div className="w-full mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-100">
              Inicia sesión para registrar tu jornada y ver tus tareas.
            </div>
          )}
          
          {error && (
            <div className="w-full mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => dispatch(clearError())}
                className="font-bold underline"
              >
                Cerrar
              </button>
            </div>
          )}

          {userId && (
            <div className="flex flex-col items-center w-full max-w-2xl">
              <div className="relative mb-8 flex justify-center w-full">
                <ClockArc variant={arcVariant} progress={arcProgress} />
                
                {statusMessage && (
                  <div
                    className={`absolute top-4 right-[-40px] px-4 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap shadow-sm border ${
                      fueraHorario && fichajeStatus === 'working'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-[#FAE8FF] text-[#D946EF] border-[#F5D0FE]'
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 justify-center w-full">
                {fichajeStatus === 'idle' && (
<button 
                      onClick={handleClockIn} 
                      disabled={isLoading || !userId}
                      className="w-full sm:w-[240px] h-[48px] bg-black text-white rounded-xl font-semibold text-[15px] hover:bg-gray-800 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoading ? 'Procesando...' : 'Fichar entrada'}
                  </button>
                )}

                {fichajeStatus === 'working' && (
                  <>
                    <button 
                      onClick={handlePause} 
                      disabled={isLoading}
                      className="w-full sm:w-[220px] h-[48px] bg-white text-black border border-black rounded-xl font-semibold text-[15px] hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      Pausar jornada
                    </button>
                    <button 
                      onClick={handleClockOut} 
                      disabled={isLoading}
                      className="w-full sm:w-[220px] h-[48px] bg-black text-white rounded-xl font-semibold text-[15px] hover:bg-gray-800 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                    >
                      Fichar salida
                    </button>
                  </>
                )}

                {fichajeStatus === 'paused' && (
                  <>
                    <button 
                      onClick={handleResume} 
                      disabled={isLoading}
                      className="w-full sm:w-[220px] h-[48px] bg-white text-black border border-black rounded-xl font-semibold text-[15px] hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      Retomar jornada
                    </button>
                    <button 
                      onClick={handleClockOut} 
                      disabled={isLoading}
                      className="w-full sm:w-[220px] h-[48px] bg-black text-white rounded-xl font-semibold text-[15px] hover:bg-gray-800 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                    >
                      Fichar salida
                    </button>
                  </>
                )}
              </div>
              
              {currentFichaje && (
                <div className="mt-6 text-gray-400 text-[13px] font-medium">
                  Hora de entrada: <span className="text-gray-900">{new Date(currentFichaje.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Agenda / Tasks Card */}
        <div className="bg-white rounded-2xl border border-border-card shadow-sm p-8">
          <div className="mb-6 flex items-center justify-between">
            <Heading level={2} className="text-[20px] font-bold text-black">Agenda (tareas pendientes)</Heading>
            <div className="text-[13px] font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              {tasks.filter(t => !t.completed).length} pendientes
            </div>
          </div>

          <div className="mb-8 flex gap-3">
            <div className="flex-1">
              <Input 
                name="newTask"
                placeholder="Añadir una nueva tarea para hoy..." 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="!rounded-xl border-border-card focus:ring-black"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
            </div>
            <button 
              onClick={handleAddTask} 
              disabled={!newTaskTitle.trim()}
              className="bg-black text-white px-6 rounded-xl font-bold text-[14px] hover:bg-gray-800 transition-all disabled:opacity-40"
            >
              Añadir
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="py-12 space-y-4">
                <div className="h-20 bg-gray-50 animate-pulse rounded-2xl" />
                <div className="h-20 bg-gray-50 animate-pulse rounded-2xl" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-gray-300 mb-2">
                  <svg width="40" height="40" className="mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <Text variant="body" className="text-gray-400 font-medium">Todo al día. No hay tareas pendientes.</Text>
              </div>
            ) : (
              tasks.map((task: Tarea) => {
                const timeRange = task.startTime
                  ? task.endTime
                    ? `${new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(task.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '12:00 - 12:40'; // Fallback to match Figma screenshot example

                return (
                  <div
                    key={task.id}
                    className="group py-5 flex flex-col gap-2 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1D4ED8] text-[12px] font-bold">
                            {timeRange}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleToggleTask(task)}
                            className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0 ${
                              task.completed 
                                ? 'bg-black border-black' 
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {task.completed && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </button>
                          <div className="flex flex-col flex-1 truncate">
                            <span className={`text-[15px] font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                              {task.title || 'Tarea'}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => setTaskToDelete(task)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                            aria-label="Eliminar tarea"
                          >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className={`mt-1.5 text-[14px] leading-relaxed max-w-4xl font-medium ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                          {task.description || 'Descripción/notas o apuntes posibles, como dirección, anotaciones de Telemarketing.. etc'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <HistorialFichajes />
      </Stack>

      <ConfirmModal
        open={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Eliminar tarea"
        description={taskToDelete ? `¿Eliminar la tarea "${taskToDelete.title}"?` : ''}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />
    </FichajesPageLayout>
  );
};

export default ControlJornada;
