/**
 * @biosstel/dashboard - Alerts Table Component
 * 
 * Table displaying user alerts with status indicators.
 */

'use client';

export interface Alert {
  id: string;
  usuario: string;
  departamento: string;
  centroTrabajo: string;
  rol?: string;
  estado: string;
  statusType?: 'tienda' | 'telemarketing' | 'comercial' | 'no-fichado' | 'fuera-horario';
}

export interface AlertsTableProps {
  alerts: Alert[];
}

export const AlertsTable = ({ alerts }: AlertsTableProps) => {
  const getStatusBadgeColor = (statusType?: string) => {
    switch (statusType) {
      case 'tienda':
      case 'telemarketing':
      case 'comercial':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'no-fichado':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'fuera-horario':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (statusType?: string) => {
    if (statusType === 'no-fichado') {
      return <span className="text-red-600 mr-1.5 text-base">⚠️</span>;
    }
    if (statusType === 'fuera-horario') {
      return <span className="text-green-600 mr-1.5 text-base">✓</span>;
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <h3 className="text-h2 font-semibold text-gray-900">Alertas</h3>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_.8fr_1fr] gap-4 px-4 pb-2 text-mini text-gray-350">
          <div>Usuario</div>
          <div>Departamento</div>
          <div>Centro de trabajo</div>
          <div>Rol</div>
          <div>Status</div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="grid grid-cols-[1.2fr_1fr_1fr_.8fr_1fr] gap-4 items-center rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <div className="text-body text-gray-900">{alert.usuario}</div>
              <div className="text-body text-gray-600">{alert.departamento}</div>
              <div className="text-body text-gray-600">{alert.centroTrabajo}</div>
              <div>
                <span className="inline-flex rounded-full bg-badge-purple px-3 py-1 text-mini font-semibold text-accent-purple">
                  {alert.rol ?? alert.estado}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                {getStatusIcon(alert.statusType)}
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-mini font-semibold border ${getStatusBadgeColor(
                    alert.statusType
                  )}`}
                >
                  {alert.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsTable;
