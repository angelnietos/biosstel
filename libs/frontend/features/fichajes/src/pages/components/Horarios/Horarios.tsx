/**
 * @biosstel/fichajes - Horarios
 * Creación de horarios específicos (Horario A1, L-V). Layout Figma.
 */

'use client';

import { Text, Button } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { Link } from '@biosstel/platform';
import { FichajesPageLayout } from '../../layouts';

export const Horarios = () => (
  <FichajesPageLayout title="Horarios">
    <Stack gap={6}>
      <div className="flex justify-end">
        <Link href="/fichajes">
          <Button type="button" variant="primary">Añadir horario (ir a Fichajes)</Button>
        </Link>
      </div>
      <div className="border border-border-card rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-card bg-table-header">
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Nombre</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Días</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Entrada / Salida</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center">
                <Text variant="muted" className="block mb-4">No hay horarios (ej. Horario A1, Lunes-Viernes).</Text>
                <Link href="/fichajes">
                  <Button type="button" variant="secondary">Ir a Fichajes para crear horarios</Button>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Stack>
  </FichajesPageLayout>
);

export default Horarios;
