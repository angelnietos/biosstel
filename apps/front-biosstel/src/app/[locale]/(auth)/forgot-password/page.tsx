import { ForgotPasswordForm } from '@biosstel/auth';
import { AuthLayout } from '@biosstel/shared';

export default function ForgotPasswordPage() {
  const handleSubmit = async (values: { email: string }) => {
    console.log('Forgot password:', values);
    // TODO: Implementar lógica de recuperación de contraseña
  };

  return (
    <AuthLayout>
      <ForgotPasswordForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
