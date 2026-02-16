import { EmailSendMessage, AuthShell } from '@biosstel/auth';

export default function EmailSendPage() {
  return (
    <AuthShell>
      <EmailSendMessage />
    </AuthShell>
  );
}
