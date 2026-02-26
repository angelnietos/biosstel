'use client';

import { useRouter, logFormSubmit } from '@biosstel/platform';
import { AuthShell } from '../shell';
import { ForgotPasswordForm } from './components';
import { useForgotPassword } from '../data-access/hooks/useForgotPassword';

/**
 * Página de recuperar contraseña: conecta formulario con API y redirige a email-send al éxito.
 */
export function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useForgotPassword();

  const handleSubmit = async (values: { email: string }) => {
    logFormSubmit('forgot_password', undefined, { email: values.email });
    await forgotPassword(values.email);
    const locale =
      typeof globalThis.window === 'undefined'
        ? 'es'
        : globalThis.window.location.pathname.split('/').find(Boolean) || 'es';
    router.push(`/${locale}/email-send`);
  };

  return (
    <AuthShell>
      <ForgotPasswordForm onSubmit={handleSubmit} />
    </AuthShell>
  );
}
