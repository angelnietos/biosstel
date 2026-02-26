/**
 * Mock de next-intl/routing para Storybook (sin Next.js).
 */

export function defineRouting(_config: { locales: string[]; defaultLocale: string }) {
  return {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  };
}
