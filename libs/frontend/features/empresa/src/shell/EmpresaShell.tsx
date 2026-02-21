/**
 * @biosstel/empresa - EmpresaShell
 */

'use client';

import { ReactNode } from 'react';

export interface EmpresaShellProps {
  children?: ReactNode;
}

export const EmpresaShell = ({ children }: EmpresaShellProps) => <>{children}</>;

export default EmpresaShell;
