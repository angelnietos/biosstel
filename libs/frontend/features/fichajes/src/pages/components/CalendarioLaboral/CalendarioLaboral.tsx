/**
 * @biosstel/fichajes - CalendarioLaboral
 * Festivos y días laborales por año. Layout Figma.
 */

'use client';

import { Text, Button } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { Link } from '@biosstel/platform';
import { FichajesPageLayout } from '../../layouts';

export const CalendarioLaboral = () => (
  <FichajesPageLayout title="Calendario laboral">
    <Stack gap={6}>
      <div className="flex justify-end">
        <Link href="/fichajes">
          <Button type="button" variant="primary">Añadir calendario / festivo (ir a Fichajes)</Button>
        </Link>
      </div>
      <div className="border border-border-card rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-card bg-table-header">
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Fecha</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Descripción</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="px-4 py-12 text-center">
                <Text variant="muted" className="block mb-4">No hay festivos configurados para este año.</Text>
                <Link href="/fichajes">
                  <Button type="button" variant="secondary">Ir a Fichajes para gestionar calendarios</Button>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Stack>
  </FichajesPageLayout>
);

export default CalendarioLaboral;
