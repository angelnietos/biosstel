/**
 * @biosstel/shared - Header
 * Main app header: Servicio técnico (mailto o callback) y menú Usuario con Cerrar sesión.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@biosstel/platform';
import { IconButton, QuestionIcon, AvatarIcon, LogoutIcon } from '@biosstel/ui';
import { ROLES } from '../../constants/roles';

const SUPPORT_EMAIL = 'soporte@biosstel.com';

export interface HeaderProps {
  userName?: string;
  userRole?: string | null;
  /** Si se proporciona, se llama al hacer clic en Servicio técnico; si no, se abre mailto. */
  onSupportClick?: () => void;
}

export const Header = ({
  userName = 'Usuario',
  userRole,
  onSupportClick,
}: HeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [userMenuOpen]);

  const supportLabel = 'Servicio técnico';
  const roleLabel = userRole ? (ROLES as Record<string, string>)[userRole] ?? userRole : null;

  return (
    <header className="flex h-16 items-center justify-end gap-4 px-6">
      {onSupportClick ? (
        <IconButton
          onClick={onSupportClick}
          className="inline-flex items-center gap-2 text-mid font-semibold text-muted hover:text-gray-700"
        >
          <QuestionIcon className="shrink-0" />
          {supportLabel}
        </IconButton>
      ) : (
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Soporte%20Biosstel`}
          className="inline-flex items-center gap-2 h-9 px-2 text-mid font-semibold text-muted hover:text-gray-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <QuestionIcon className="shrink-0 w-4 h-4" />
          {supportLabel}
        </a>
      )}

      <div className="relative" ref={menuRef}>
        <IconButton
          onClick={() => setUserMenuOpen((v) => !v)}
          className="inline-flex h-8 items-center gap-2 px-2 text-mid font-normal text-black hover:opacity-80"
          aria-expanded={userMenuOpen}
          aria-haspopup="true"
        >
          <AvatarIcon className="shrink-0 rounded-full bg-gray-200" />
          {userName}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </IconButton>

        {userMenuOpen && (
          <div
            className="absolute right-0 top-full mt-1 py-2 w-56 rounded-lg bg-white border border-gray-200 shadow-lg z-50"
            role="menu"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              {roleLabel && <p className="text-xs text-gray-500 mt-0.5">{roleLabel}</p>}
            </div>
            <Link
              href="/logout"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
              role="menuitem"
              onClick={() => setUserMenuOpen(false)}
            >
              <LogoutIcon className="w-4 h-4 shrink-0" />
              Cerrar sesión
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
