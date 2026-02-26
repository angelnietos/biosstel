/**
 * @biosstel/objetivos - AsignacionPersonas
 * Desglose de objetivos por usuario. Layout Figma.
 */

'use client';

import { Card, Heading, Text } from '@biosstel/ui';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Link, PATHS } from '@biosstel/platform';

export const AsignacionPersonas = () => (
  <PageContainer maxWidth="lg">
    <Stack gap={6}>
      <Heading level={1} className="text-gray-900 font-bold">
        Asignación por personas
      </Heading>
      <Text variant="body" className="text-muted">
        Desglose de objetivos por usuario. Las asignaciones de personas se gestionan en Resultados (Objetivos terminales), en la sección «Asignaciones personas».
      </Text>
      <div className="flex justify-end">
        <Link href={PATHS.OBJETIVOS_TERMINALES} className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
          Ver en Objetivos terminales
        </Link>
      </div>
      <Card className="p-5 shadow-sm overflow-hidden">
        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Usuario</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Departamento</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Objetivo</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center">
                  <Text variant="muted" className="block mb-4">No hay asignaciones por persona. Configúralas en Resultados → Objetivos terminales.</Text>
                  <Link href={PATHS.OBJETIVOS_TERMINALES} className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Ir a Objetivos terminales
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </Stack>
  </PageContainer>
);

export default AsignacionPersonas;
