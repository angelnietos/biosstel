import { Chip, Pagination } from '@biosstel/ui';
import { Link } from '@biosstel/platform';
import type { User } from '../../../api/types';

export interface UserListProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  className?: string;
  currentPage?: number;
  totalUsers?: number;
  onPageChange?: (page: number) => void;
}

export const UserList = ({ 
  users, 
  className = '',
  currentPage = 1,
  totalUsers = 0,
  onPageChange
}: UserListProps) => {
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

  const SortIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 opacity-40">
      <path d="M6 2L3 5H9L6 2Z" fill="currentColor" />
      <path d="M6 10L9 7H3L6 10Z" fill="currentColor" />
    </svg>
  );

  return (
    <div className={`bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-card bg-table-header">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                <div className="flex items-center cursor-pointer">
                  Usuario <SortIcon />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                <div className="flex items-center cursor-pointer">
                  Departamento <SortIcon />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                <div className="flex items-center cursor-pointer">
                  Centro de trabajo <SortIcon />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                <div className="flex items-center cursor-pointer">
                  Rol <SortIcon />
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-muted uppercase tracking-wide">
                <div className="flex items-center justify-center cursor-pointer">
                  Status <SortIcon />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-card">
            {!Array.isArray(users) || users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted">
                  No hay usuarios. Añade uno desde el botón superior.
                </td>
              </tr>
            ) : (
            users.map((user) => (
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
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex justify-center">
                    {getStatusIcon(user.isActive)}
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
