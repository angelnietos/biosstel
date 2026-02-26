/**
 * @biosstel/shared - Alerts Table (presentacional)
 * Recibe alerts por props; tipo DashboardAlert de shared-types.
 */

'use client';

import type { DashboardAlert } from '@biosstel/shared-types';
import { Chip, ClockXIcon, ClockAlertIcon, Skeleton, Pagination } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';

export interface AlertsTableProps {
  alerts: DashboardAlert[];
  isLoading?: boolean;
  /** Paginación (Figma). Si no se pasa, se usa current=1 y total=alerts.length */
  currentPage?: number;
  totalAlerts?: number;
  onPageChange?: (page: number) => void;
}

const PAGE_SIZE = 10;

export const AlertsTable = ({
  alerts,
  isLoading = false,
  currentPage = 1,
  totalAlerts,
  onPageChange,
}: AlertsTableProps) => {
  const total = totalAlerts ?? alerts.length;
  const showPagination = total > PAGE_SIZE || (onPageChange != null && total > 0);

  const getRolBadgeColor = (rol?: string) => {
    switch (rol?.toLowerCase()) {
      case 'tienda':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]';
      case 'telemarketing':
        return 'bg-[#FDF2F8] text-[#DB2777] border-[#FBCFE8]';
      case 'comercial':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadgeColor = (statusType?: string) => {
    switch (statusType) {
      case 'no-fichado':
        return 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]';
      case 'fuera-horario':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (statusType?: string) => {
    if (statusType === 'no-fichado') {
      return <ClockXIcon className="mr-1.5" />;
    }
    if (statusType === 'fuera-horario') {
      return <ClockAlertIcon className="mr-1.5" />;
    }
    return null;
  };

  const SortIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 opacity-40">
      <path d="M6 2L3 5H9L6 2Z" fill="currentColor" />
      <path d="M6 10L9 7H3L6 10Z" fill="currentColor" />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden p-6">
        <Stack gap={4}>
          <Skeleton height="md" className="w-32" />
          <Stack gap={2}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="lg" className="w-full" />
            ))}
          </Stack>
        </Stack>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden p-6">
        <h3 className="text-h2 font-semibold text-gray-900 mb-4">Alertas</h3>
        <p className="text-gray-500 text-center py-8">No hay alertas disponibles</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-h2 font-semibold text-gray-900">Alertas</h3>
      </div>
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                <div className="flex items-center cursor-pointer">
                  Status <SortIcon />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-card">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{alert.usuario}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-muted">{alert.departamento}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-muted">{alert.centroTrabajo}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Chip className={`!font-semibold !rounded-md ${getRolBadgeColor(alert.rol)}`}>
                    {alert.rol}
                  </Chip>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Chip
                    className={`!font-semibold !rounded-md ${getStatusBadgeColor(
                      alert.statusType
                    )}`}
                  >
                    {getStatusIcon(alert.statusType)}
                    {alert.estado}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
          current={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default AlertsTable;
