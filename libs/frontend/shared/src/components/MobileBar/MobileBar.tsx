/**
 * @biosstel/shared - MobileBar
 * Bottom nav for mobile (Figma).
 */

'use client';

import { Link, usePathname } from '@biosstel/platform';
import type { NavItem } from '../../types/nav';

export interface MobileBarProps {
  navItems: NavItem[];
}

export const MobileBar = ({ navItems }: MobileBarProps) => {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-col items-center border-t border-border-nav bg-white">
      <div className="flex w-full items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const CurrentIcon = isActive && item.IconActive ? item.IconActive : item.Icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex size-9 items-center justify-center rounded-lg ${
                isActive ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-blue-50'
              }`}
            >
              <CurrentIcon size={20} />
            </Link>
          );
        })}
      </div>
      <div className="mb-2 h-1 w-32 rounded-full bg-black" />
    </nav>
  );
};

export default MobileBar;
