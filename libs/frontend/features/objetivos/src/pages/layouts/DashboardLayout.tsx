/**
 * @biosstel/objetivos - DashboardLayout
 * Layout con Sidebar filtrado por rol (canAccessPath). Ítems según Figma: Inicio, Fichajes, Usuario/as, Objetivos, Productos, Resultados, Alertas, Inventario, Empresa, Operaciones, Back office.
 */

'use client';

import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { SidebarLayout } from '@biosstel/ui-layout';
import { Sidebar } from '@biosstel/shared';
import { usePathname } from '@biosstel/platform';
import { canAccessPath, PATHS } from '@biosstel/platform';
import {
  HomeIcon,
  UsersIcon,
  SidebarClockIcon,
  UserPlusIcon,
  ChartIcon,
  CubeIcon,
  CalendarIcon,
} from '@biosstel/ui';
import type { NavItem } from '@biosstel/shared';

/** Todos los ítems posibles del sidebar (path sin locale). Se filtran por rol con canAccessPath. */
const ALL_NAV_ITEMS: Omit<NavItem, 'Icon'> & { Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { path: PATHS.HOME, label: 'Inicio', Icon: HomeIcon },
  { path: PATHS.FICHAJES, label: 'Fichajes', Icon: SidebarClockIcon },
  { path: PATHS.USERS, label: 'Usuario/as', Icon: UsersIcon },
  { path: PATHS.OBJETIVOS, label: 'Objetivos', Icon: ChartIcon },
  { path: PATHS.PRODUCTOS, label: 'Productos', Icon: CubeIcon },
  { path: PATHS.REPORTS, label: 'Resultados', Icon: ChartIcon },
  { path: PATHS.ALERTAS, label: 'Alertas', Icon: UserPlusIcon },
  { path: PATHS.INVENTORY, label: 'Inventario', Icon: CubeIcon },
  { path: PATHS.EMPRESA, label: 'Empresa', Icon: CalendarIcon },
  { path: PATHS.OPERACIONES, label: 'Operaciones', Icon: CalendarIcon },
  { path: PATHS.BACKOFFICE, label: 'Back office', Icon: ChartIcon },
];

function useNavItemsWithLocale(): NavItem[] {
  const pathname = usePathname();
  const user = useSelector((state: { auth?: { user?: { role?: string } } }) => state.auth?.user);
  const userRole = user?.role ?? null;
  const locale = (pathname && pathname.startsWith('/') ? pathname.split('/').filter(Boolean)[0] : null) || 'es';
  const isLocale = (s: string) => ['es', 'en'].includes(s);
  const actualLocale = isLocale(locale) ? locale : 'es';

  return ALL_NAV_ITEMS.filter((item) => canAccessPath(item.path, userRole)).map((item) => ({
    ...item,
    path: `/${actualLocale}${item.path}`,
  }));
}

export interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navItems = useNavItemsWithLocale();

  return (
    <SidebarLayout 
      sidebar={<Sidebar navItems={navItems} />} 
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
