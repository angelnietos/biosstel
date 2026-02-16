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
    <div className={`flex min-h-screen ${className}`}>
      <aside className={`${sidebarWidth} flex-shrink-0 border-r border-gray-200`}>
        {sidebar}
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
