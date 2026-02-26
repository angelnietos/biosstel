'use client';

/**
 * Envuelve páginas tipo "workspace" (add-user, add-client) con aspecto de modal:
 * fondo oscuro y panel centrado.
 */

import { ReactNode, useEffect } from 'react';
import { Link } from '@biosstel/platform';

export interface WorkspaceModalShellProps {
  /** URL completa de vuelta (ej. /es/users o /es/home) */
  returnHref: string;
  /** Texto del enlace de cerrar/volver */
  returnLabel?: string;
  children: ReactNode;
  /** Ancho máximo del panel (por defecto 720px, estilo modal grande) */
  maxWidth?: 'm' | 'l';
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M1 1l11 11M12 1L1 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WorkspaceModalShell({
  returnHref,
  returnLabel = 'Volver',
  children,
  maxWidth = 'l',
}: WorkspaceModalShellProps) {
  const maxWidthClass = maxWidth === 'l' ? 'max-w-[720px]' : 'max-w-[540px]';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ventana de workspace"
    >
      <Link
        href={returnHref}
        className="absolute inset-0 bg-black/40 transition-opacity"
        aria-hidden
        tabIndex={-1}
      >
        <span className="sr-only">Cerrar</span>
      </Link>
      <div
        className={`relative flex w-full flex-col rounded-2xl bg-white px-6 py-6 shadow-dropdown ${maxWidthClass}`}
      >
        <div className="flex items-center justify-end gap-2 pb-2">
          <Link
            href={returnHref}
            className="text-mid font-medium text-gray-600 hover:text-gray-900"
          >
            {returnLabel}
          </Link>
          <Link
            href={returnHref}
            className="p-1.5 rounded hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </Link>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
