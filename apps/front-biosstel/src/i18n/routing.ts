import { defineRouting } from 'next-intl/routing';

/**
 * Config de rutas para el middleware (edge).
 * Debe vivir en la app para que el bundle edge resuelva bien.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
});
