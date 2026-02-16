/**
 * @biosstel/dashboard - Dashboard Layout
 * 
 * Main layout for dashboard pages with sidebar navigation.
 */

'use client';

import { ReactNode } from 'react';
import { SidebarLayout } from '@biosstel/ui-layout';
import { Link } from '@biosstel/platform';
import { usePathname } from 'next/navigation';

export interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { href: '/home', label: 'Inicio', icon: '🏠' },
  { href: '/search', label: 'Búsqueda', icon: '🔍' },
  { href: '/clock', label: 'Reloj', icon: '🕐' },
  { href: '/users', label: 'Usuarios', icon: '👥' },
  { href: '/settings', label: 'Configuración', icon: '⚙️' },
  { href: '/reports', label: 'Reportes', icon: '📊' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = pathname?.split('/')[1] || 'es';

  const Sidebar = (
    <nav className="h-full bg-white shadow-sm flex flex-col items-center py-4">
      <div className="flex-1 w-full flex flex-col items-center gap-3 pt-2">
        {navigationItems.map((item) => {
          const fullPath = `/${locale}${item.href}`;
          const isActive = pathname === fullPath || pathname?.startsWith(fullPath + '/');
          return (
            <Link
              key={item.href}
              href={fullPath}
              aria-label={item.label}
              title={item.label}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
            </Link>
          );
        })}
      </div>

      <div className="pb-2">
        <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-mid">N</span>
        </div>
      </div>
    </nav>
  );

  return (
    <SidebarLayout sidebar={Sidebar} sidebarWidth="w-[92px]" className="bg-gray-100">
      <div className="min-h-screen bg-gray-100">
        <header className="h-16 flex items-center justify-end px-8 gap-6">
          <div className="text-mid text-gray-600">Servicio técnico</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-mini font-bold">
              N
            </div>
            <div className="text-mid text-gray-600">Nombre usuario</div>
          </div>
        </header>
        <div className="px-8 pb-10">
          {children}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DashboardLayout;
