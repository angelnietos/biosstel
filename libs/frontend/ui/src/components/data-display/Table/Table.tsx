/**
 * @biosstel/ui - Table
 * Semantic table wrapper. Use TableHead, TableBody, TableRow, TableTh, TableCell.
 */

import { ReactNode } from 'react';

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => (
  <table className={`w-full text-sm ${className}`.trim()}>{children}</table>
);

export const TableHead = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <thead className={className}>{children}</thead>
);

export const TableBody = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <tbody className={`divide-y divide-gray-50 ${className}`.trim()}>{children}</tbody>
);

export const TableRow = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <tr className={`border-b border-gray-100 ${className}`.trim()}>{children}</tr>
);

export const TableTh = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${className}`.trim()}>
    {children ?? null}
  </th>
);

export const TableCell = ({ children, className = '', colSpan }: { children: ReactNode; className?: string; colSpan?: number }) => (
  <td className={`px-4 py-4 ${className}`.trim()} colSpan={colSpan}>{children}</td>
);
