/**
 * @biosstel/objetivos - AsignacionDepartamentos
 * Reparto de objetivos por centros de trabajo. Layout Figma.
 */

'use client';

import { Card, Heading, Text } from '@biosstel/ui';
import { PageContainer, Stack, Grid } from '@biosstel/ui-layout';
import { Link, PATHS } from '@biosstel/platform';

export const AsignacionDepartamentos = () => (
  <PageContainer maxWidth="lg">
    <Stack gap={6}>
      <Heading level={1} className="text-gray-900 font-bold">
        Asignación por departamentos
      </Heading>
      <Text variant="body" className="text-muted">
        Reparte objetivos por centros de trabajo. Las asignaciones activas se gestionan y visualizan en Resultados (Objetivos terminales).
      </Text>
      <Grid cols={2} gap={4}>
        {['Comercial', 'Tienda', 'Telemarketing', 'Departamento 2'].map((name) => (
          <Card key={name} className="p-5 shadow-sm">
            <Stack gap={3}>
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">{name}</span>
                <Link href={PATHS.OBJETIVOS_TERMINALES} className="inline-flex items-center justify-center rounded px-3 py-1 text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                  Ver en Resultados
                </Link>
              </div>
              <Text variant="small" className="text-gray-300">
                Total 0 / 0 — Sin asignación
              </Text>
              <p className="text-sm text-muted">No hay centros asignados en este departamento.</p>
            </Stack>
          </Card>
        ))}
      </Grid>
      <Card className="p-8 text-center shadow-sm border border-gray-100">
        <Text variant="body" className="text-muted block mb-4">
          Para ver y editar las asignaciones por departamento con datos reales, abre Resultados (Objetivos terminales).
        </Text>
        <Link href={PATHS.OBJETIVOS_TERMINALES} className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
          Ir a Objetivos terminales
        </Link>
      </Card>
    </Stack>
  </PageContainer>
);

export default AsignacionDepartamentos;
