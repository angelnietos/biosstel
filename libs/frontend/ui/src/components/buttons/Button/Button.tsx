/**
 * @biosstel/ui - Button
 * Componente de UI atómico. Sin lógica de negocio.
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'primaryLg' | 'secondary' | 'outline' | 'cancelLg' | 'raw';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
    raw: '',
    primary:
      'h-[43px] min-h-[43px] px-5 text-body bg-black text-white hover:bg-gray-900 focus:ring-gray-500 disabled:hover:bg-black whitespace-nowrap',
    primaryLg:
      'flex w-full items-center justify-center gap-2.5 py-3 px-4 text-sm leading-normal text-white shadow-button bg-black hover:bg-gray-900 disabled:bg-button-disabled focus:ring-gray-500 whitespace-nowrap',
    secondary:
      'h-[43px] min-h-[43px] px-5 text-body bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 whitespace-nowrap',
    outline:
      'h-[43px] min-h-[43px] px-5 text-body border-2 border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus:ring-gray-400 whitespace-nowrap',
    cancelLg:
      'flex w-full items-center justify-center gap-2.5 rounded-lg border border-transparent py-3 px-4 text-sm leading-normal text-black transition-colors duration-200 hover:border-black disabled:bg-transparent disabled:text-button-disabled',
  };

  const widthStyles =
    fullWidth || variant === 'primaryLg' || variant === 'cancelLg'
      ? 'w-full'
      : '';

  const variantClass = variant === 'raw' ? '' : variantStyles[variant ?? 'primary'];
  const baseClass = variant === 'raw' ? 'font-medium transition-colors disabled:cursor-not-allowed' : baseStyles;

  return (
    <button
      className={`${baseClass} ${variantClass} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {typeof children === 'string' ? children + '...' : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
