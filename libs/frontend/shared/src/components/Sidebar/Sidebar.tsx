'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, usePathname } from '@biosstel/platform';
import { LogoutIcon } from '@biosstel/ui';
import { getRoleLabel } from '@biosstel/platform';
import type { NavItem } from '../../types/nav';

const SIDEBAR_CONFIG = {
  expanded: { width: 220 },
  collapsed: { width: 64 },
};

export interface SidebarProps {
  navItems: NavItem[];
}

export const Sidebar = ({ navItems }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const user = useSelector((state: any) => state.auth?.user);
  const userName = user?.name ?? user?.email ?? 'Usuario';
  const userRoleLabel = getRoleLabel(user?.role) || null;
  const activeWidth = isCollapsed ? SIDEBAR_CONFIG.collapsed.width : SIDEBAR_CONFIG.expanded.width;

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const BiosstelLogo = () => (
    <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'items-center scale-90' : ''}`}>
      <div className="flex items-center gap-0.5">
        <span className="text-brand-primary font-bold text-[18px] leading-none">bioss</span>
        <span className="text-brand-accent font-bold text-[18px] leading-none border-b-2 border-brand-accent">tel</span>
      </div>
      {!isCollapsed && (
        <span className="text-gray-400 text-[10px] font-medium tracking-wider uppercase mt-0.5">
          comunicaciones
        </span>
      )}
    </div>
  );

  return (
    <aside
      style={{ width: activeWidth }}
      className="flex h-screen flex-col bg-white py-6 shadow-sidebar z-50 overflow-hidden relative border-r border-border-card transition-[width] duration-300 ease-out"
    >
      {/* Logo & Toggle */}
      <div className={`mb-10 flex items-center ${isCollapsed ? 'justify-center px-1' : 'justify-between px-6'}`}>
        <BiosstelLogo />
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            title="Colapsar menú"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="mb-4 flex justify-center">
           <button 
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            title="Expandir menú"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
      )}

      {/* Nav Items */}
      <nav className={`flex flex-1 flex-col gap-2.5 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          const Icon = isActive && item.IconActive ? item.IconActive : item.Icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              title={isCollapsed ? item.label : ''}
              className={`flex h-[42px] items-center rounded-2xl transition-all relative group ${
                isActive
                  ? 'bg-brand-primary text-white shadow-[1px_4px_12px_rgba(0,81,158,0.25)]'
                  : 'text-muted hover:bg-gray-50 hover:text-gray-900'
              } ${isCollapsed ? 'justify-center w-10 mx-auto px-0' : 'gap-3 px-4'}`}
            >
              <div className={`shrink-0 ${isActive ? 'text-white' : 'text-inherit opacity-70 group-hover:opacity-100'}`}>
                <Icon size={20} />
              </div>

              {!isCollapsed && (
                <span className="overflow-hidden whitespace-nowrap text-[14px] font-semibold transition-opacity tracking-tight">
                  {item.label}
                </span>
              )}

              {isActive && !isCollapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white opacity-40 shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className={`mt-auto pt-6 border-t border-gray-100 flex flex-col items-center gap-4 ${isCollapsed ? 'px-1' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="w-full flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="size-8 shrink-0 rounded-full bg-gray-800 text-white flex items-center justify-center text-[11px] font-bold border-2 border-white shadow-sm ring-1 ring-gray-100">
                {userName.split(/\s+/).map((s: string) => s[0]).join('').slice(0, 2).toUpperCase() || userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-[12px] font-bold text-gray-900 leading-none truncate" title={userName}>{userName}</span>
                {userRoleLabel && (
                  <span className="text-[10px] text-gray-400 font-medium tracking-tight">{userRoleLabel}</span>
                )}
              </div>
            </div>
            <Link href="/logout" title="Cerrar sesión" className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <LogoutIcon size={18} />
            </Link>
          </div>
        )}
        
        {isCollapsed && (
          <Link href="/logout" title="Cerrar sesión" className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <LogoutIcon size={20} />
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

