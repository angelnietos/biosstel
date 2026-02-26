/**
 * @biosstel/alertas - Alerts Dashboard
 * Filtros conectados a GET /alertas con query params; tabla o empty state.
 */

'use client';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logUserAction } from '@biosstel/platform';
import { Card, Button } from '@biosstel/ui';
import { AlertsTable } from '@biosstel/shared';
import { fetchAlertas, type AlertasState, type AlertaTipo } from '../../../data-access';

const TIPO_OPTIONS: { value: '' | AlertaTipo; label: string }[] = [
  { value: '', label: 'Tipo' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'recordatorios', label: 'Recordatorios' },
  { value: 'tracking', label: 'Tracking' },
];

export const AlertsDashboard = () => {
  const dispatch = useDispatch();
  const { alerts, totalAlerts, currentPage, isLoading: alertsLoading, error: alertsError } = useSelector((state: { alertas: AlertasState }) => state.alertas);
  const [tipo, setTipo] = useState<'' | AlertaTipo>('');
  const [fecha, setFecha] = useState('');
  const [marca, setMarca] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [centroTrabajo, setCentroTrabajo] = useState('');
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);

  const loadAlertas = useCallback((page = 1) => {
    (dispatch as (thunk: ReturnType<typeof fetchAlertas>) => void)(fetchAlertas({
      tipo: tipo || undefined,
      filters: {
        marca: marca ? [marca] : undefined,
        departamento: departamento ? [departamento] : undefined,
        centroTrabajo: centroTrabajo ? [centroTrabajo] : undefined,
      },
      page,
      pageSize: 10,
    }));
  }, [dispatch, tipo, marca, departamento, centroTrabajo]);

  const handleApplyFilters = () => {
    logUserAction('alertas_apply_filters', undefined, { tipo, marca, departamento, centroTrabajo });
    setHasAppliedFilter(true);
    loadAlertas(1);
  };

  const handlePageChange = useCallback((page: number) => {
    loadAlertas(page);
  }, [loadAlertas]);

  const showTable = hasAppliedFilter;

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-8">
      {/* Header with Title (Figma: página Alertas) */}
      <div className="flex justify-between items-center">
        <h1 className="text-h1 font-bold text-gray-900">Alertas</h1>
        <div className="bg-[#FAE8FF] text-[#D946EF] px-3 py-1 rounded-full text-xs font-semibold">
          Activos / desactivados
        </div>
      </div>

      {/* Filters: tipo, fecha, marca, departamento, centro (Figma) */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as '' | AlertaTipo)}
          className="rounded-lg border border-border-card px-3 py-2.5 text-sm text-gray-900 bg-white min-h-[43px]"
        >
          {TIPO_OPTIONS.map((o) => (
            <option key={o.value || 'all'} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-border-card px-3 py-2.5 text-sm text-gray-900 bg-white min-h-[43px] w-40"
          aria-label="Filtrar por fecha"
        >
          <option value="">Fecha</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mes</option>
        </select>
        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="rounded-lg border border-border-card px-3 py-2.5 text-sm text-gray-900 bg-white min-h-[43px] w-40"
        >
          <option value="">Marca</option>
          <option value="marca1">Marca 1</option>
          <option value="marca2">Marca 2</option>
        </select>
        <input
          type="text"
          placeholder="Departamento"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          className="rounded-lg border border-border-card px-3 py-2.5 text-sm text-gray-900 bg-white min-h-[43px] w-40"
        />
        <input
          type="text"
          placeholder="Centro de trabajo"
          value={centroTrabajo}
          onChange={(e) => setCentroTrabajo(e.target.value)}
          className="rounded-lg border border-border-card px-3 py-2.5 text-sm text-gray-900 bg-white min-h-[43px] w-40"
        />
        <Button type="button" variant="primary" onClick={handleApplyFilters} className="min-h-[43px]">
          Aplicar filtros
        </Button>
      </div>

      {/* Empty state: pedir filtro antes de mostrar datos */}
      {!showTable && (
        <Card className="rounded-2xl py-20 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 text-[#D946EF] font-medium text-sm">
            <span>Primero se ha de filtrar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
            <span>para mostrar los datos posteriormente</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
          <p className="text-gray-600 text-sm">
            Elige tipo, departamento o centro y pulsa «Aplicar filtros» para ver las alertas.
          </p>
        </Card>
      )}

      {/* Alertas Section (tabla cuando ya se aplicó filtro) */}
      {showTable && (
        <div className="space-y-6">
          <h2 className="text-h2 font-bold text-gray-900">Alertas</h2>
          {alertsError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100">
              {alertsError}
              <button type="button" onClick={() => loadAlertas(1)} className="ml-2 font-medium underline">Reintentar</button>
            </div>
          )}
          <AlertsTable
            alerts={alerts}
            isLoading={alertsLoading}
            currentPage={currentPage}
            totalAlerts={totalAlerts}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AlertsDashboard;
