/**
 * @biosstel/auth - EmailSendMessage
 * Usa solo @biosstel/ui, @biosstel/ui-layout, @biosstel/platform.
 */

'use client';

import { Link } from '@biosstel/platform';
import { Button, Heading, Text } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';

export const EmailSendMessage = () => (
  <Stack gap={6} align="center">
    <Heading level={1}>Email enviado</Heading>
    <Text variant="body">
      Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada.
    </Text>
    <Link href="/login">
      <Button fullWidth>Volver al login</Button>
    </Link>
  </Stack>
);

export default EmailSendMessage;
