/**
 * @biosstel/dashboard - Alerts Table Component
 * 
 * Table displaying user alerts with status indicators.
 */

'use client';

import type { DashboardAlert as Alert } from '@biosstel/shared-types';

export interface AlertsTableProps {
  alerts: Alert[];
}

export const AlertsTable = ({ alerts }: AlertsTableProps) => {
  const getRolBadgeColor = (rol?: string) => {
    // Todos los roles en morado/púrpura como en el Figma
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  const getStatusBadgeColor = (statusType?: string) => {
    switch (statusType) {
      case 'no-fichado':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'fuera-horario':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (statusType?: string) => {
    if (statusType === 'no-fichado') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block mr-1">
          <circle cx="8" cy="8" r="7" fill="#DC2626" />
          <path d="M8 4.5v4M8 10.5v1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (statusType === 'fuera-horario') {
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block mr-1">
          <circle cx="8" cy="8" r="7" fill="#16A34A" />
          <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return null;
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-h2 font-semibold text-gray-900 mb-4">Alertas</h3>
        <p className="text-gray-500 text-center py-8">No hay alertas disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-h2 font-semibold text-gray-900">Alertas</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-mini font-semibold text-gray-500 uppercase tracking-wide">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-mini font-semibold text-gray-500 uppercase tracking-wide">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-mini font-semibold text-gray-500 uppercase tracking-wide">
                Centro de trabajo
              </th>
              <th className="px-6 py-3 text-left text-mini font-semibold text-gray-500 uppercase tracking-wide">
                Rol
              </th>
              <th className="px-6 py-3 text-right text-mini font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{alert.usuario}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{alert.departamento}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{alert.centroTrabajo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border ${getRolBadgeColor(
                      alert.rol
                    )}`}
                  >
                    {alert.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold border ${getStatusBadgeColor(
                      alert.statusType
                    )}`}
                  >
                    {getStatusIcon(alert.statusType)}
                    {alert.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsTable;
