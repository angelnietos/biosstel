'use client';

import { GlobalErrorFallback } from '@biosstel/shared';

export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <GlobalErrorFallback {...props} />;
}
