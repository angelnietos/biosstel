/**
 * @biosstel/auth - RegistroSalida
 * Usa solo @biosstel/ui, @biosstel/ui-layout, @biosstel/platform.
 */

'use client';

import { Link } from '@biosstel/platform';
import { Button, Heading, Text, Card } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { AuthPageLayout } from '../../layouts';

export const RegistroSalida = () => (
  <AuthPageLayout title="Registro de Salida">
    <Stack gap={6} align="center">
      <Stack gap={2} align="center">
        <Heading level={2}>Fin de Jornada</Heading>
        <Text variant="body">Tu jornada ha sido registrada correctamente.</Text>
      </Stack>
      <Card>
        <Stack gap={2} align="center">
          <Text variant="body">Salida confirmada</Text>
          <Text variant="mini">Hasta mañana</Text>
        </Stack>
      </Card>
      <Link href="/home">
        <Button fullWidth>Volver al inicio</Button>
      </Link>
    </Stack>
  </AuthPageLayout>
);

export default RegistroSalida;
