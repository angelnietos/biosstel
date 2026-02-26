/**
 * @biosstel/fichajes - Geolocalizacion
 * Tracking de ubicación y alertas de inactividad. Layout Figma.
 */

'use client';

import { useRef } from 'react';
import { Card, Text, Button } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { FichajesPageLayout } from '../../layouts';

export const Geolocalizacion = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  return (
  <FichajesPageLayout title="Geolocalización">
    <Stack gap={6}>
      <Text variant="body" className="text-muted">
        Tracking de ubicación para perfiles comerciales. Alertas de inactividad (45 min).
      </Text>
      <Card className="p-8 text-center shadow-sm border border-border-card rounded-xl">
        <Text variant="muted" className="block mb-4">
          No hay ubicaciones en tiempo real registradas. El listado inferior se actualiza con los fichajes que incluyan ubicación.
        </Text>
        <Button
          type="button"
          variant="secondary"
          onClick={() => tableRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          Ver listado
        </Button>
      </Card>
      <div ref={tableRef} className="border border-border-card rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-card bg-table-header">
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Usuario</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Última ubicación</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center">
                <Text variant="muted">No hay datos de geolocalización.</Text>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Stack>
  </FichajesPageLayout>
  );
};

export default Geolocalizacion;
