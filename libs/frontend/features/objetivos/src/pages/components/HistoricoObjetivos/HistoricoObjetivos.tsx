/**
 * @biosstel/objetivos - HistoricoObjetivos
 * Consulta de meses anteriores y productos desactivados. Layout Figma.
 */

'use client';

import { Card, Heading, Text } from '@biosstel/ui';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Link, PATHS } from '@biosstel/platform';

export const HistoricoObjetivos = () => (
  <PageContainer maxWidth="lg">
    <Stack gap={6}>
      <Heading level={1} className="text-gray-900 font-bold">
        Histórico de objetivos
      </Heading>
      <Text variant="body" className="text-muted">
        Consulta meses anteriores y el progreso por periodo. El histórico por mes (Contratos y Puntos) está en Resultados.
      </Text>
      <Card className="p-8 shadow-sm border border-gray-100 text-center">
        <Text variant="body" className="text-muted block mb-4">
          Para ver el progreso y las asignaciones de meses anteriores, abre Resultados (Objetivos terminales) y usa la sección «Histórico» al final de la página.
        </Text>
        <Link
          href={PATHS.OBJETIVOS_TERMINALES}
          className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Ir a Objetivos terminales (Histórico)
        </Link>
      </Card>
    </Stack>
  </PageContainer>
);

export default HistoricoObjetivos;
