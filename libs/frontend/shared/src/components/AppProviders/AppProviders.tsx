'use client';

import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import type { Store } from 'redux';

export interface AppProvidersProps {
  store: Store;
  children: ReactNode;
}

/** Redux provider only. Compose AuthRestore/ApiErrorHandler in app/shell. */
export function AppProviders({ store, children }: AppProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
