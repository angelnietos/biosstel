/**
 * @biosstel/ui-layout - Centered Layout Component
 *
 * Generic centered layout for forms, login pages, etc.
 * Does NOT know about business domain.
 */

import { ReactNode } from 'react';

export interface CenteredLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

export const CenteredLayout = ({
  children,
  className = '',
  maxWidth = 'max-w-md',
}: CenteredLayoutProps) => {
  return (
    <div className={`flex min-h-screen w-full items-center justify-center p-4 ${className}`}>
      <div className={`w-full ${maxWidth}`}>{children}</div>
    </div>
  );
};

export default CenteredLayout;
