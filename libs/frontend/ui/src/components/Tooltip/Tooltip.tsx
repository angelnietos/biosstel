/**
 * @biosstel/ui - Tooltip
 * Componente de UI atómico para tooltips.
 */

import { ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip = ({ content, children, placement = 'top', className = '' }: TooltipProps) => {
  const positionClass =
    placement === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-1'
      : placement === 'bottom'
        ? 'top-full left-1/2 -translate-x-1/2 mt-1'
        : placement === 'left'
          ? 'right-full top-1/2 -translate-y-1/2 mr-1'
          : 'left-full top-1/2 -translate-y-1/2 ml-1';

  return (
    <span className={`relative inline-block group ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`absolute ${positionClass} px-2 py-1 text-mini text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap`}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
