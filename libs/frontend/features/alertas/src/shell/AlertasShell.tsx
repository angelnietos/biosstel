/**
 * @biosstel/alertas - Alertas Shell
 * Contenedor de layout para la sección Alertas.
 */

'use client';

import { ReactNode } from 'react';

export interface AlertasShellProps {
  children?: ReactNode;
}

export const AlertasShell = ({ children }: AlertasShellProps) => <>{children}</>;

export default AlertasShell;
