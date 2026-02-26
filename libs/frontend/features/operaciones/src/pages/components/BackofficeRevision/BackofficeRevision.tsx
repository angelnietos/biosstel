/**
 * @biosstel/operaciones - BackofficeRevision
 * Contratos pendientes de validar. Layout Figma. Datos desde API.
 */

'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Button } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { OperacionesPageLayout } from '../../layouts';
import { fetchOperaciones, updateRevisionEstado, type OperacionesState } from '../../../data-access';
import type { RevisionBackoffice } from '@biosstel/shared-types';
import { RevisarModal } from './RevisarModal';

export const BackofficeRevision = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { operaciones: OperacionesState }) => state.operaciones);
  const revision = data?.revision ?? [];
  const [revisando, setRevisando] = useState<RevisionBackoffice | null>(null);

  const loadData = () => (dispatch as (thunk: ReturnType<typeof fetchOperaciones>) => void)(fetchOperaciones());

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const isEmpty = !loading && !error && revision.length === 0;

  const handleAprobar = (id: string) => {
    dispatch(updateRevisionEstado({ id, estado: 'Aprobado' }));
  };

  const handleRechazar = (id: string) => {
    dispatch(updateRevisionEstado({ id, estado: 'Rechazado' }));
  };

  return (
    <OperacionesPageLayout title="Backoffice - Revisión">
      <Stack gap={6}>
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={loadData}>
            Refrescar
          </Button>
        </div>
        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Contrato / Tarea</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Fecha</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>}
              {error && <tr><td colSpan={4} className="px-4 py-8 text-center text-red-600">{error}</td></tr>}
              {!loading && !error && revision.length > 0 && revision.map((r) => (
                <tr key={r.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{r.contratoTarea}</td>
                  <td className="px-4 py-3 text-muted">{r.fecha}</td>
                  <td className="px-4 py-3 text-muted">{r.estado}</td>
                  <td className="px-4 py-3">
                    <Button type="button" variant="secondary" className="!py-1 !text-sm" onClick={() => setRevisando(r)}>
                      Revisar
                    </Button>
                  </td>
                </tr>
              ))}
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4">No hay contratos pendientes de validar.</Text>
                    <Button type="button" variant="secondary" onClick={loadData}>Refrescar</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Stack>
      <RevisarModal
        open={!!revisando}
        onClose={() => setRevisando(null)}
        item={revisando}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />
    </OperacionesPageLayout>
  );
};

export default BackofficeRevision;
