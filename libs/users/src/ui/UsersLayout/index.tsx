/**
 * @biosstel/users - UsersLayout Component
 * 
 * Layout component for users management pages.
 * Uses ui-layout but doesn't know about Next.js routing.
 */

import { ReactNode } from 'react';

export interface UsersLayoutProps {
  children: ReactNode;
  className?: string;
}

export const UsersLayout = ({
  children,
  className = '',
}: UsersLayoutProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default UsersLayout;
