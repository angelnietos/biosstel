/**
 * @biosstel/dashboard - Dashboard Home Page (Figma-like)
 *
 * This component renders the Home dashboard view.
 * Kept in the library so Next.js pages stay thin (no view logic in pages).
 */

'use client';

import { useState } from 'react';
import { DashboardLayout } from '../../layouts';
import { DashboardFilters } from '../DashboardFilters';
import { ObjectiveCard } from '../ObjectiveCard';
import { AlertsTable } from '../AlertsTable';
import { useDashboardHome } from '../../data-access';

export const DashboardHomePage = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const hasFilters = Object.values(filters).some((arr) => arr.length > 0);

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setFilters(filters);
  };

  // Always fetch data (alerts should always show, objectives depend on filters)
  const { data, isLoading, error } = useDashboardHome(filters, true);

  return (
    <DashboardLayout>
      <div className="max-w-[1180px]">
        <h1 className="text-h1 font-bold text-gray-900 mb-4">Inicio</h1>

        <DashboardFilters onFilterChange={handleFilterChange} />

        {!hasFilters ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 mb-6">
            <div className="text-mini text-accent-magenta font-semibold mb-2">
              Primero se ha de filtrar ↑ para mostrar los datos de objetivos posteriormente ↓
            </div>
            <div className="text-mid text-gray-600">
              Por favor realiza un filtro previo para que se muestren los datos de objetivos.
            </div>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse"
              >
                <div className="h-3 w-40 bg-gray-100 rounded mb-4" />
                <div className="h-8 w-64 bg-gray-100 rounded mb-3" />
                <div className="h-2 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-5 mb-6 text-error">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(data?.objectives ?? []).map((obj) => (
              <ObjectiveCard
                key={obj.id}
                title={obj.title}
                achieved={obj.achieved}
                objective={obj.objective}
                accent={obj.accent as any}
                href={obj.href}
              />
            ))}
          </div>
        )}

        <AlertsTable alerts={data?.alerts ?? []} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;

