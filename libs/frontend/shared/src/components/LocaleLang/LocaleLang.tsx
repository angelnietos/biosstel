'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Sets document.documentElement.lang from the first URL segment (locale). Runs in root layout, so it cannot use next-intl context. */
export function LocaleLang() {
  const pathname = usePathname() ?? '';
  const locale = pathname.split('/').filter(Boolean)[0] ?? 'es';

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
