import { LocaleLang } from '@biosstel/shared';
import { DevFlowLoggerInit } from '@biosstel/platform';
import type { ReactNode } from 'react';

export interface RootLayoutViewProps {
  bodyClassName?: string;
  children: ReactNode;
}

export function RootLayoutView({ bodyClassName = '', children }: RootLayoutViewProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={bodyClassName}>
        <LocaleLang />
        <DevFlowLoggerInit />
        {children}
      </body>
    </html>
  );
}
