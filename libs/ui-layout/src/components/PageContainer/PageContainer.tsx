/**
 * @biosstel/ui-layout - Page Container Component
 * 
 * Generic page container that provides consistent padding and layout.
 * Does NOT know about business domain (no "admin", "users", etc.)
 */

import { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'main' | 'section' | 'div';
}

export const PageContainer = ({
  children,
  className = '',
  as: Component = 'main',
}: PageContainerProps) => {
  return (
    <Component className={`min-h-screen w-full p-4 md:p-6 ${className}`}>
      {children}
    </Component>
  );
};

export default PageContainer;
