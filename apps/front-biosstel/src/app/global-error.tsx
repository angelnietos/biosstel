'use client';

import { GlobalErrorFallback } from '@biosstel/shared';

export default function GlobalError(props: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return <GlobalErrorFallback {...props} />;
}
