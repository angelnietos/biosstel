/**
 * @biosstel/users - UsersLayout
 * Layout interno para listado/gestión de usuarios.
 */

import { ReactNode } from 'react';

export interface UsersLayoutProps {
  children: ReactNode;
  className?: string;
}

export const UsersLayout = ({ children, className = '' }: UsersLayoutProps) => {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
};

export default UsersLayout;
