/**
 * @biosstel/operaciones - TelemarketingAgenda
 * Tareas pendientes y anotaciones. Layout Figma. Datos desde API.
 */

'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logUserAction } from '@biosstel/platform';
import { Text, Button } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { OperacionesPageLayout } from '../../layouts';
import { fetchOperaciones, addTarea, updateTarea, type OperacionesState } from '../../../data-access';
import type { TareaAgenda } from '@biosstel/shared-types';
import { TareaFormModal } from './TareaFormModal';

export const TelemarketingAgenda = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { operaciones: OperacionesState }) => state.operaciones);
  const agenda = data?.agenda ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTarea, setEditingTarea] = useState<TareaAgenda | null>(null);

  useEffect(() => {
    (dispatch as (thunk: ReturnType<typeof fetchOperaciones>) => void)(fetchOperaciones());
  }, [dispatch]);

  const isEmpty = !loading && !error && agenda.length === 0;

  const openNew = () => {
    logUserAction('operaciones_telemarketing_nueva_tarea');
    setEditingTarea(null);
    setModalOpen(true);
  };

  const openEdit = (t: TareaAgenda) => {
    setEditingTarea(t);
    setModalOpen(true);
  };

  const handleSubmit = (payload: { id?: string; tarea: string; cliente: string; estado: string }) => {
    if (payload.id) {
      dispatch(updateTarea({ id: payload.id, tarea: payload.tarea, cliente: payload.cliente, estado: payload.estado }));
    } else {
      dispatch(addTarea({ tarea: payload.tarea, cliente: payload.cliente, estado: payload.estado }));
    }
  };

  return (
    <OperacionesPageLayout title="Telemarketing - Agenda">
      <Stack gap={6}>
        <div className="flex justify-end">
          <Button type="button" variant="primary" onClick={openNew}>
            Nueva tarea
          </Button>
        </div>
        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Tarea</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Cliente</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>}
              {error && <tr><td colSpan={4} className="px-4 py-8 text-center text-red-600">{error}</td></tr>}
              {!loading && !error && agenda.length > 0 && agenda.map((a) => (
                <tr key={a.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{a.tarea}</td>
                  <td className="px-4 py-3 text-muted">{a.cliente}</td>
                  <td className="px-4 py-3 text-muted">{a.estado}</td>
                  <td className="px-4 py-3">
                    <Button type="button" variant="secondary" className="!py-1 !text-sm" onClick={() => openEdit(a)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4">No hay tareas pendientes.</Text>
                    <Button type="button" variant="secondary" onClick={openNew}>
                      Nueva tarea
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Stack>
      <TareaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tarea={editingTarea}
        onSubmit={handleSubmit}
      />
    </OperacionesPageLayout>
  );
};

export default TelemarketingAgenda;
