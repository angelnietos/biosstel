/**
 * @biosstel/shared - MobileBar
 * Bottom nav for mobile (Figma: Home, Reloj). Muestra Inicio y Fichajes con etiquetas.
 */

'use client';

import { Link, usePathname } from '@biosstel/platform';
import type { NavItem } from '../../types/nav';

export interface MobileBarProps {
  navItems: NavItem[];
}

/** Figma App móvil: bottom nav con Home y Reloj. Solo ítems Inicio y Fichajes. */
export const MobileBar = ({ navItems }: MobileBarProps) => {
  const pathname = usePathname() ?? '';
  const mobileItems = navItems.filter((item) => item.label === 'Inicio' || item.label === 'Fichajes').slice(0, 2);
  const items = mobileItems.length >= 2 ? mobileItems : navItems.slice(0, 2);

  return (
    <nav className="flex w-full flex-col items-center border-t border-border-nav bg-white safe-area-pb">
      <div className="flex w-full items-center justify-around py-2">
        {items.map((item) => {
          const isActive = pathname === item.path || pathname.endsWith(item.path === '/' ? '' : item.path) || (item.path !== '/' && pathname.includes(item.path));
          const CurrentIcon = isActive && item.IconActive ? item.IconActive : item.Icon;
          const label = item.label === 'Inicio' ? 'Home' : item.label === 'Fichajes' ? 'Reloj' : item.label;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-4 py-2 min-w-[72px] ${
                isActive ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <CurrentIcon size={24} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBar;
