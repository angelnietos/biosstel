/**
 * @biosstel/operaciones - ComercialVisitas
 * Registro de visitas (Nueva/Seguimiento). Layout Figma. Datos desde API.
 */

'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Button } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { OperacionesPageLayout } from '../../layouts';
import { fetchOperaciones, type OperacionesState } from '../../../data-access';

export const ComercialVisitas = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { operaciones: OperacionesState }) => state.operaciones);
  const visitas = data?.visitas ?? [];

  useEffect(() => {
    (dispatch as (thunk: ReturnType<typeof fetchOperaciones>) => void)(fetchOperaciones());
  }, [dispatch]);

  const isEmpty = !loading && !error && visitas.length === 0;

  return (
    <OperacionesPageLayout title="Comercial - Visitas">
      <Stack gap={6}>
        <div className="flex justify-end">
          <Button type="button" variant="primary">Nueva visita</Button>
        </div>
        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Cliente</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Fecha</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>}
              {error && <tr><td colSpan={4} className="px-4 py-8 text-center text-red-600">{error}</td></tr>}
              {!loading && !error && visitas.length > 0 && visitas.map((v) => (
                <tr key={v.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{v.cliente}</td>
                  <td className="px-4 py-3 text-muted">{v.tipo}</td>
                  <td className="px-4 py-3 text-muted">{v.fecha}</td>
                  <td className="px-4 py-3"><Button type="button" variant="secondary" className="!py-1 !text-sm">Editar</Button></td>
                </tr>
              ))}
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4">No hay visitas.</Text>
                    <Button type="button" variant="secondary">Nueva visita</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Stack>
    </OperacionesPageLayout>
  );
};

export default ComercialVisitas;
