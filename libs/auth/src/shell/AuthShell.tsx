/**
 * @biosstel/auth - AuthShell Component
 * 
 * Shell container for auth feature.
 * Wraps all auth-related pages.
 */

import { ReactNode } from 'react';
import { AuthLayout } from '@biosstel/shared';

export interface AuthShellProps {
  children: ReactNode;
}

export const AuthShell = ({ children }: AuthShellProps) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default AuthShell;
