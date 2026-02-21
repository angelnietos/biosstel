/**
 * @biosstel/ui-layout - Page Container Component
 *
 * Generic page container that provides consistent padding and layout.
 * Does NOT know about business domain (no "admin", "users", etc.)
 */

import { ReactNode } from 'react';

const maxWidthMap = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1280px]',
  '2xl': 'max-w-[1400px]',
  full: '',
} as const;

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'main' | 'section' | 'div';
  /** Constrain content width; use 'xl' for dashboards (1280px). */
  maxWidth?: keyof typeof maxWidthMap;
}

export const PageContainer = ({
  children,
  className = '',
  as: Component = 'main',
  maxWidth,
}: PageContainerProps) => {
  const maxClass = maxWidth ? `${maxWidthMap[maxWidth]} mx-auto` : '';
  return (
    <Component className={`min-h-screen w-full p-4 md:p-6 ${maxClass} ${className}`.trim()}>
      {children}
    </Component>
  );
};

export default PageContainer;
