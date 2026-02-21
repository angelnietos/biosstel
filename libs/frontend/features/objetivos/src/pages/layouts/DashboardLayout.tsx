/**
 * @biosstel/objetivos - DashboardLayout
 * Layout interno de la feature dashboard.
 */

'use client';

import type { ReactNode } from 'react';
import { SidebarLayout } from '@biosstel/ui-layout';
import { Sidebar } from '@biosstel/shared';
import {
  HomeIcon,
  UsersIcon,
  SidebarClockIcon,
  UserPlusIcon,
  ChartIcon,
  CubeIcon,
} from '@biosstel/ui';

export interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { path: '/home', label: 'Inicio', Icon: HomeIcon },
  { path: '/users', label: 'Usuarios', Icon: UsersIcon },
  { path: '/clock', label: 'Reloj', Icon: SidebarClockIcon },
  { path: '/alertas', label: 'Alertas', Icon: UserPlusIcon },
  { path: '/reports', label: 'Reportes', Icon: ChartIcon },
  { path: '/inventory', label: 'Inventario', Icon: CubeIcon },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarLayout 
      sidebar={<Sidebar navItems={navigationItems} />} 
      sidebarWidth="" // Width handled by Sidebar motion.aside
      className="bg-table-header"
    >
      <div className="min-h-screen flex flex-col">
        <header className="h-16 flex items-center justify-end px-8 gap-6 bg-transparent">
          <div className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-gray-900 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Servicio técnico
          </div>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-[#00519E] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm ring-1 ring-gray-100">
              A
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-[#111827] leading-tight">Nombre usuario</div>
              <div className="text-[11px] text-muted font-medium leading-tight">Admin</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarLayout>
  );
};


export default DashboardLayout;
