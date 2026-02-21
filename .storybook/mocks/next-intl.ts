/**
 * Mock de next-intl para Storybook (sin Next.js).
 * Devuelve la clave como texto para que se vean los keys en las stories.
 */

import type React from 'react';

export function useTranslations(_namespace?: string) {
  return (key: string) => key;
}

export function useLocale() {
  return 'es';
}

export function NextIntlClientProvider({
  children,
}: {
  children: React.ReactNode;
  locale?: string;
  messages?: Record<string, string>;
}) {
  return children as React.ReactElement;
}
