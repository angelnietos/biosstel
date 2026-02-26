/**
 * @biosstel/users - UsersShell Component
 *
 * Shell container for users feature.
 */

import { ReactNode } from 'react';

export interface UsersShellProps {
  children: ReactNode;
}

export const UsersShell = ({ children }: UsersShellProps) => {
  return <div className="users-shell">{children}</div>;
};

export default UsersShell;
