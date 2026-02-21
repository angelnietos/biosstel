/**
 * @biosstel/ui - Alert
 * Inline message (error, success, info). No business logic.
 */

import { ReactNode } from 'react';

export type AlertVariant = 'error' | 'success' | 'info';

export interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700',
  success: 'rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700',
  info: 'rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700',
};

export const Alert = ({ children, variant = 'error', className = '' }: AlertProps) => {
  return (
    <div className={`${variantClasses[variant]} ${className}`.trim()} role="alert">
      {children}
    </div>
  );
};

export default Alert;
