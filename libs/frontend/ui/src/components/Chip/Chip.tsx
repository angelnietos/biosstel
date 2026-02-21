/**
 * @biosstel/ui - Chip
 * Componente de UI atómico para etiquetas/badges.
 */

import { ReactNode } from 'react';

export interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  onRemove?: () => void;
  className?: string;
}

export const Chip = ({ children, variant = 'default', onRemove, className = '' }: ChipProps) => {
  const variantStyles: Record<NonNullable<ChipProps['variant']>, string> = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-mini font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded hover:bg-black/10 p-0.5"
          aria-label="Quitar"
        >
          <span className="sr-only">Quitar</span>
          <span aria-hidden>×</span>
        </button>
      )}
    </span>
  );
};

export default Chip;
