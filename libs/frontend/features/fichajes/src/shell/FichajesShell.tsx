/**
 * @biosstel/fichajes - FichajesShell
 */

'use client';

import type { ReactNode } from 'react';

export interface FichajesShellProps {
  children?: ReactNode;
}

export const FichajesShell = ({ children }: FichajesShellProps) => <>{children}</>;

export default FichajesShell;
