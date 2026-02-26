/**
 * @biosstel/ui - Modal
 * Atomic modal overlay. Figma: rounded-20, shadow-dropdown. Uses CSS for transition.
 */

'use client';

import { ReactNode, useEffect } from 'react';

const sizeMap = {
  s: 'max-w-[420px]',
  m: 'max-w-[540px]',
  l: 'max-w-[720px]',
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: 's' | 'm' | 'l';
  allowClose?: boolean;
  children: ReactNode;
  className?: string;
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

export const Modal = ({
  open,
  onClose,
  size = 's',
  allowClose = true,
  children,
  className = '',
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && allowClose) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, allowClose, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={allowClose ? onClose : undefined}
        aria-hidden
      />
      <div
        className={`relative flex w-full flex-col gap-4 rounded-20 bg-white px-10 py-8 shadow-dropdown transition-all ${sizeMap[size]} ${className}`}
      >
        {allowClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1 cursor-pointer rounded hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
