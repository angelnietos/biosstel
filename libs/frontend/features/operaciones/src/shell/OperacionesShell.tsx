/**
 * @biosstel/operaciones - OperacionesShell
 */

'use client';

import { ReactNode } from 'react';

export interface OperacionesShellProps {
  children?: ReactNode;
}

export const OperacionesShell = ({ children }: OperacionesShellProps) => <>{children}</>;

export default OperacionesShell;
