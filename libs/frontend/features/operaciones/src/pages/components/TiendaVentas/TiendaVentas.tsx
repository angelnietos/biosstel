/**
 * @biosstel/operaciones - TiendaVentas
 * Objetivos por punto de venta. Layout Figma. Datos desde API.
 */

'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Text, Button } from '@biosstel/ui';
import { Stack, Grid } from '@biosstel/ui-layout';
import { OperacionesPageLayout } from '../../layouts';
import { fetchOperaciones, type OperacionesState } from '../../../data-access';

export const TiendaVentas = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { operaciones: OperacionesState }) => state.operaciones);
  const tienda = data?.tienda ?? [];

  const loadData = () => (dispatch as (thunk: ReturnType<typeof fetchOperaciones>) => void)(fetchOperaciones());

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const isEmpty = !loading && !error && tienda.length === 0;

  return (
    <OperacionesPageLayout title="Tienda - Ventas">
      <Stack gap={6}>
        <div className="flex justify-between items-center">
          <Text variant="body" className="text-muted">
            Objetivos por punto de venta y nivel de logro.
          </Text>
          <Button type="button" variant="secondary" onClick={loadData} disabled={loading}>
            Refrescar
          </Button>
        </div>
        {loading && <p className="text-muted">Cargando...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && tienda.length > 0 && (
          <Grid cols={2} gap={4}>
            {tienda.map((t) => {
              const pct = t.objective > 0 ? Math.min(100, (t.achieved / t.objective) * 100) : 0;
              return (
                <Card key={t.id} className="p-5 shadow-sm border border-border-card">
                  <Stack gap={3}>
                    <span className="text-base font-semibold text-gray-900">{t.puntoVenta}</span>
                    <Text variant="small" className="text-muted">{t.achieved} / {t.objective}</Text>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent-blue transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Stack>
                </Card>
              );
            })}
          </Grid>
        )}
        {isEmpty && (
          <div className="text-center py-6">
            <Text variant="muted" className="block mb-4">No hay datos de ventas por tienda.</Text>
            <Button type="button" variant="secondary" onClick={loadData}>Refrescar</Button>
          </div>
        )}
      </Stack>
    </OperacionesPageLayout>
  );
};

export default TiendaVentas;
