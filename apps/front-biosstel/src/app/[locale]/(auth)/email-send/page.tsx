import { EmailSendMessage } from '@biosstel/auth';
import { AuthLayout } from '@biosstel/shared';

export default function EmailSendPage() {
  return (
    <AuthLayout>
      <EmailSendMessage />
    </AuthLayout>
  );
}
