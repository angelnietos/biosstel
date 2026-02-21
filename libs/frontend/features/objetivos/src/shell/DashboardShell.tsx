/**
 * @biosstel/objetivos - DashboardShell Component
 *
 * Shell container for dashboard/objetivos feature.
 * Layout (Sidebar/Header) lo aplica la app vía MainAppLayout.
 */

import { ReactNode } from 'react';

export interface DashboardShellProps {
  children: ReactNode;
}

export const DashboardShell = ({ children }: DashboardShellProps) => {
  return <>{children}</>;
};

export default DashboardShell;
