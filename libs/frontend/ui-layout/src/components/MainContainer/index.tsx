/**
 * @biosstel/ui-layout - MainContainer Component
 * 
 * Container layout for auth pages (login, register).
 * Generic component that does NOT know about business domain.
 */

import { ReactNode } from 'react';

export interface MainContainerProps {
  children?: ReactNode;
  className?: string;
}

export const MainContainer = ({
  children,
  className = '',
}: MainContainerProps) => {
  return (
    <div className={`w-full max-w-80 px-4 md:max-w-86 md:px-0 ${className}`}>
      {children}
    </div>
  );
};

export default MainContainer;
