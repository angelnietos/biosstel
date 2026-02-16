'use client';

import { useSearchParams } from 'next/navigation';
import { VerifyAccountMessage } from '@biosstel/auth';
import { AuthLayout } from '@biosstel/shared';

export default function VerifyAccountPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <AuthLayout>
      <VerifyAccountMessage token={token} />
    </AuthLayout>
  );
}
