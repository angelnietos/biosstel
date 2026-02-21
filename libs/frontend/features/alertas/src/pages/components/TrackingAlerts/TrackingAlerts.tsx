/**
 * @biosstel/alertas - TrackingAlerts
 * Fichaje fuera de horario / inactividad GPS. Layout Figma. Datos desde API (tipo=tracking).
 */

'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Button } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { AlertasPageLayout } from '../../layouts';
import { fetchAlertas, type AlertasState } from '../../../data-access';

export const TrackingAlerts = () => {
  const dispatch = useDispatch();
  const { alerts: alertas, isLoading: loading, error } = useSelector((state: { alertas: AlertasState }) => state.alertas);

  useEffect(() => {
    (dispatch as (thunk: ReturnType<typeof fetchAlertas>) => void)(fetchAlertas({ tipo: 'tracking' }));
  }, [dispatch]);

  const loadData = () => (dispatch as (thunk: ReturnType<typeof fetchAlertas>) => void)(fetchAlertas({ tipo: 'tracking' }));
  const isEmpty = !loading && !error && alertas.length === 0;

  return (
    <AlertasPageLayout title="Tracking y alertas">
      <Stack gap={6}>
        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Usuario</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>}
              {error && <tr><td colSpan={3} className="px-4 py-8 text-center text-red-600">{error}</td></tr>}
              {!loading && !error && alertas.length > 0 && alertas.map((a) => (
                <tr key={a.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{a.usuario ?? '—'}</td>
                  <td className="px-4 py-3 text-muted">{a.estado ?? 'Fichaje fuera de horario'}</td>
                  <td className="px-4 py-3"><Button type="button" variant="secondary" className="!py-1 !text-sm">Ver</Button></td>
                </tr>
              ))}
              {isEmpty && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4">No hay alertas de tracking.</Text>
                    <Button type="button" variant="secondary" onClick={loadData}>Refrescar</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Stack>
    </AlertasPageLayout>
  );
};

export default TrackingAlerts;
