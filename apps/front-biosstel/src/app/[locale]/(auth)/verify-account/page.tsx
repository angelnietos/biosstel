'use client';

import { useSearchParams } from 'next/navigation';
import { VerifyAccountMessage, AuthShell } from '@biosstel/auth';

export default function VerifyAccountPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <AuthShell>
      <VerifyAccountMessage token={token} />
    </AuthShell>
  );
}
