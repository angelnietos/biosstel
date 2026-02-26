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
  /** Logo URL (e.g. /images/logo.png). Omit to hide. */
  logoSrc?: string;
  /** Background image URL for the right panel. Omit to hide. */
  backgroundSrc?: string;
}

const DEFAULT_LOGO = '/images/logo.png';
const DEFAULT_BACKGROUND = '/images/background.png';

export const AuthShell = ({
  children,
  logoSrc = DEFAULT_LOGO,
  backgroundSrc = DEFAULT_BACKGROUND,
}: AuthShellProps) => {
  return (
    <AuthLayout logoSrc={logoSrc} backgroundSrc={backgroundSrc}>
      {children}
    </AuthLayout>
  );
};

export default AuthShell;
