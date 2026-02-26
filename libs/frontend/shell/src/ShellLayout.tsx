'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ToastProvider } from '@biosstel/ui';
import { AppLayout, navItems, AUTH_PATHS, SHELL_HOME_PATH } from '@biosstel/shared';
import { canAccessPath, DevFlowLoggerInit } from '@biosstel/platform';
import { ExportLogsToDbButton } from './ExportLogsToDbButton';
import type { ReactNode } from 'react';

export interface ShellLayoutProps {
  locale: string;
  messages: Record<string, unknown>;
  children: ReactNode;
}

export function ShellLayout({ locale, messages, children }: ShellLayoutProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DevFlowLoggerInit />
      <ToastProvider>
        <ExportLogsToDbButton />
        <AppLayout
          navItems={navItems}
          authPaths={AUTH_PATHS}
          homePath={SHELL_HOME_PATH}
          canAccessPath={canAccessPath}
        >
          {children}
        </AppLayout>
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
