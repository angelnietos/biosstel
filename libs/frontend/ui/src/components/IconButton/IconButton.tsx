/**
 * @biosstel/ui - IconButton
 * Atomic UI component for icon-only actions.
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const IconButton = ({
  children,
  className = '',
  disabled = false,
  ...props
}: IconButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-1 rounded font-medium transition-colors ${
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
