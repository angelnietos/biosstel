import { ForgotPasswordForm, AuthShell } from '@biosstel/auth';

export default function ForgotPasswordPage() {
  const handleSubmit = async (values: { email: string }) => {
    console.log('Forgot password:', values);
    // TODO: Implementar lógica de recuperación de contraseña
  };

  return (
    <AuthShell>
      <ForgotPasswordForm onSubmit={handleSubmit} />
    </AuthShell>
  );
}
