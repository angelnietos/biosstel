'use client';

import React, { useState, useMemo } from 'react';
import { Chip, Pagination } from '@biosstel/ui';
import { Link } from '@biosstel/platform';
import type { User } from '../../../api/types';

export type UserListSortKey = 'name' | 'departamento' | 'centroTrabajo' | 'role' | 'status';

export interface UserListProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  className?: string;
  currentPage?: number;
  totalUsers?: number;
  onPageChange?: (page: number) => void;
  /** Callout opcional por fila (ej. "Aparece que no ha fichado...") cuando aplique */
  getStatusCallout?: (user: User) => string | null;
  /** Si se proporciona, las cabeceras son clicables y ordenan por esta clave (Figma: cabecera ordenable). */
  sortBy?: UserListSortKey;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: UserListSortKey) => void;
}

export const UserList = ({ 
  users, 
  className = '',
  currentPage = 1,
  totalUsers = 0,
  onPageChange,
  getStatusCallout,
  sortBy,
  sortDir = 'asc',
  onSort,
}: UserListProps) => {
  const [localSort, setLocalSort] = useState<{ key: UserListSortKey; dir: 'asc' | 'desc' } | null>(null);
  const effectiveSort = sortBy != null ? { key: sortBy, dir: sortDir } : localSort;
  const handleSort = (key: UserListSortKey) => {
    if (onSort) {
      onSort(key);
      return;
    }
    setLocalSort((prev) => (prev?.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  };

  const sortedUsers = useMemo(() => {
    if (!effectiveSort) return users;
    const key = effectiveSort.key;
    const dir = effectiveSort.dir === 'asc' ? 1 : -1;
    return [...users].sort((a, b) => {
      const av = key === 'name' ? [a.firstName, a.lastName].filter(Boolean).join(' ') || a.email : key === 'departamento' ? (a as any).departamento : key === 'centroTrabajo' ? (a as any).centroTrabajo : key === 'role' ? a.role : a.isActive ? 'activo' : 'inactivo';
      const bv = key === 'name' ? [b.firstName, b.lastName].filter(Boolean).join(' ') || b.email : key === 'departamento' ? (b as any).departamento : key === 'centroTrabajo' ? (b as any).centroTrabajo : key === 'role' ? b.role : b.isActive ? 'activo' : 'inactivo';
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
    });
  }, [users, effectiveSort]);

  const getRoleBadgeColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'comercial':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]';
      case 'telemarketing':
        return 'bg-[#FDF2F8] text-[#DB2777] border-[#FBCFE8]';
      case 'tienda':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (isActive?: boolean) => {
    return (
      <div className={`w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center shadow-sm overflow-hidden`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#10B981" : "#EF4444"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {isActive ? (
            <polyline points="20 6 9 17 4 12"></polyline>
          ) : (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          )}
        </svg>
      </div>
    );
  };

  const SortIcon = ({ column }: { column: UserListSortKey }) => {
    const active = effectiveSort?.key === column;
    return (
      <span className="ml-1 inline-flex flex-col opacity-60">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={active && effectiveSort?.dir === 'asc' ? 'text-brand-primary' : ''}><path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={active && effectiveSort?.dir === 'desc' ? 'text-brand-primary' : ''}><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    );
  };

  const Th = ({ column, children }: { column: UserListSortKey; children: React.ReactNode }) => (
    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wide">
      <button type="button" onClick={() => handleSort(column)} className="flex items-center cursor-pointer hover:text-gray-900">
        {children} <SortIcon column={column} />
      </button>
    </th>
  );

  return (
    <div className={`bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-card bg-table-header">
              <Th column="name">Usuario</Th>
              <Th column="departamento">Departamento</Th>
              <Th column="centroTrabajo">Centro de trabajo</Th>
              <Th column="role">Rol</Th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-muted uppercase tracking-wide">
                <button type="button" onClick={() => handleSort('status')} className="flex items-center justify-center cursor-pointer hover:text-gray-900 w-full">
                  Status <SortIcon column="status" />
                </button>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-card">
            {!Array.isArray(sortedUsers) || sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted">
                  No hay usuarios. Añade uno desde el botón superior.
                </td>
              </tr>
            ) : (
            sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || user.id}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-muted">
                    {(user as any).departamento ?? (user as any).department ?? '—'}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-muted">
                    {(user as any).centroTrabajo ?? (user as any).workCenter ?? '—'}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Chip className={`!font-semibold !rounded-md ${getRoleBadgeColor(user.role)}`}>
                    {user.role || 'Comercial'}
                  </Chip>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex justify-center">{getStatusIcon(user.isActive)}</div>
                    {getStatusCallout?.(user) && (
                      <span className="text-xs text-gray-500 text-center max-w-[180px]">
                        {getStatusCallout(user)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <Link
                    href={`/users/${user.id}`}
                    className="text-sm font-medium text-brand-primary hover:text-brand-accent underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        current={currentPage}
        total={totalUsers || (users?.length || 0)}
        pageSize={10}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UserList;
