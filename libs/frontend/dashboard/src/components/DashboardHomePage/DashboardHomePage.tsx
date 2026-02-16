/**
 * @biosstel/dashboard - Dashboard Home Page (Figma-like)
 *
 * This component renders the Home dashboard view.
 * Kept in the library so Next.js pages stay thin (no view logic in pages).
 */

'use client';

import { useMemo, useState } from 'react';
import { DashboardLayout } from '../../layouts';
import { DashboardFilters } from '../DashboardFilters';
import { ObjectiveCard } from '../ObjectiveCard';
import { AlertsTable, type Alert } from '../AlertsTable';

const mockObjectives = [
  {
    title: 'Terminales (Familia X)',
    achieved: 12867,
    objective: 34560,
    accent: 'maroon' as const,
    href: '/objetivos-terminales',
  },
  { title: 'Familia Y', achieved: 10124, objective: 89988, accent: 'teal' as const },
  { title: 'Familia', achieved: 37009, objective: 36134, accent: 'blue' as const },
  { title: 'Producto X', achieved: 57112, objective: 76110, accent: 'purple' as const },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    usuario: 'Isabelle Torres',
    departamento: 'Comercial',
    centroTrabajo: 'Barakaldo',
    rol: 'Comercial',
    estado: 'No ha fichado',
    statusType: 'no-fichado',
  },
  {
    id: '2',
    usuario: 'Maria Robledo',
    departamento: 'Comercial',
    centroTrabajo: 'Las Arenas',
    rol: 'Telemarketing',
    estado: 'No ha fichado',
    statusType: 'no-fichado',
  },
  {
    id: '3',
    usuario: 'Lucia Martinez',
    departamento: 'Comercial',
    centroTrabajo: 'Las Arenas',
    rol: 'Comercial',
    estado: 'Fichaje fuera de horario',
    statusType: 'fuera-horario',
  },
];

export const DashboardHomePage = () => {
  const [hasFilters, setHasFilters] = useState(false);

  const handleFilterChange = (filters: Record<string, string[]>) => {
    const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);
    setHasFilters(hasActiveFilters);
  };

  const objectives = useMemo(() => mockObjectives, []);

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {objectives.map((obj) => (
              <ObjectiveCard
                key={obj.title}
                title={obj.title}
                achieved={obj.achieved}
                objective={obj.objective}
                accent={obj.accent}
                href={obj.href}
              />
            ))}
          </div>
        )}

        <AlertsTable alerts={mockAlerts} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;

