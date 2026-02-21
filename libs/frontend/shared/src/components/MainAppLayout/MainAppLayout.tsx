/**
 * @biosstel/shared - MainAppLayout
 * Layout with Sidebar, Header, main content and MobileBar (Figma).
 */

'use client';

import { ReactNode } from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { MobileBar } from '../MobileBar';
import type { NavItem } from '../../types/nav';

export interface MainAppLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  userName?: string;
  userRole?: string | null;
  onSupportClick?: () => void;
}

export const MainAppLayout = ({
  children,
  navItems,
  userName = 'Usuario',
  userRole,
  onSupportClick,
}: MainAppLayoutProps) => (
  <div className="flex h-screen bg-gray-100">
    <div className="hidden md:block">
      <Sidebar navItems={navItems} />
    </div>
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header userName={userName} userRole={userRole} onSupportClick={onSupportClick} />
      <main className="flex-1 overflow-y-auto px-2 pb-20 pt-2 sm:px-6 md:pb-6">
        {children}
      </main>
    </div>
    <div className="fixed bottom-0 left-0 z-50 w-full md:hidden">
      <MobileBar navItems={navItems} />
    </div>
  </div>
);

export default MainAppLayout;
