/**
 * @biosstel/ui-layout - Sidebar Layout Component
 *
 * Generic layout with sidebar navigation.
 * Does NOT know about business domain (admin, users, etc.)
 */

import { ReactNode } from 'react';

export interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  className?: string;
  sidebarWidth?: string;
}

export const SidebarLayout = ({
  children,
  sidebar,
  className = '',
  sidebarWidth = 'w-64',
}: SidebarLayoutProps) => {
  return (
    <div className={`flex min-h-screen bg-gray-50 ${className}`}>
      <aside className={`${sidebarWidth} flex-shrink-0`}>{sidebar}</aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default SidebarLayout;
