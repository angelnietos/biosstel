/**
 * @biosstel/ui - Pagination
 * Biosstel Platinum style pagination.
 */

'use client';

import { ReactNode } from 'react';

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  className?: string;
  showInfo?: boolean;
}

export const Pagination = ({
  current,
  total,
  pageSize,
  onPageChange,
  className = '',
  showInfo = true,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize) || 1;
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  return (
    <div className={`flex items-center justify-between w-full px-6 py-4 border-t border-border-card ${className}`}>
      {showInfo && (
        <div className="text-sm text-muted">
          Mostrando <span className="font-medium text-gray-900">{from}</span> a{' '}
          <span className="font-medium text-gray-900">{to}</span> de{' '}
          <span className="font-medium text-gray-900">{total}</span> resultados
        </div>
      )}

      <div className="flex-1 flex justify-center">
        <div className="bg-[#374151] text-white px-4 py-1.5 rounded-lg flex items-center gap-4 text-sm font-medium shadow-sm">
          <button
            onClick={() => current > 1 && onPageChange?.(current - 1)}
            disabled={current <= 1}
            className={`transition-opacity ${current <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}`}
            aria-label="Anterior"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="tabular-nums">
            {current}/{totalPages}
          </span>

          <button
            onClick={() => current < totalPages && onPageChange?.(current + 1)}
            disabled={current >= totalPages}
            className={`transition-opacity ${current >= totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}`}
            aria-label="Siguiente"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
