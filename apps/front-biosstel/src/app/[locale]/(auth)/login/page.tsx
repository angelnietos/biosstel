import { LoginForm } from '@biosstel/auth';
import { AuthLayout } from '@biosstel/shared';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
