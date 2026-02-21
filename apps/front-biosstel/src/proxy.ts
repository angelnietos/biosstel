import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  return createMiddleware({
    locales: ['es', 'en'],
    defaultLocale: 'es',
  })(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
