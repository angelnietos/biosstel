'use client';

import { ReactNode } from 'react';
import { AppProviders } from '@biosstel/shared';
import { AuthRestore, ApiErrorHandler } from '@biosstel/auth';
import { store } from '@biosstel/shell';

interface Props {
  children: ReactNode;
}

export const Providers = ({ children }: Props) => (
  <AppProviders store={store}>
    <AuthRestore />
    <ApiErrorHandler />
    {children}
  </AppProviders>
);
