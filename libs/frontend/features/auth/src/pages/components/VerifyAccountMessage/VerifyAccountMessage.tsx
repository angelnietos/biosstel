/**
 * @biosstel/auth - VerifyAccountMessage
 * Usa solo @biosstel/ui, @biosstel/ui-layout, @biosstel/platform.
 */

'use client';

import { Link } from '@biosstel/platform';
import { Button, Heading, Text } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';

export interface VerifyAccountMessageProps {
  token?: string | null;
}

export const VerifyAccountMessage = ({ token }: VerifyAccountMessageProps) => (
  <Stack gap={6} align="center">
    <Heading level={1}>Verificar cuenta</Heading>
    <Text variant="body">
      {token ? 'Tu cuenta ha sido verificada exitosamente.' : 'Verificando tu cuenta...'}
    </Text>
    <Link href="/login">
      <Button fullWidth>Ir al login</Button>
    </Link>
  </Stack>
);

export default VerifyAccountMessage;
