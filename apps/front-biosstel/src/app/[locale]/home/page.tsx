'use client';

import { DashboardLayout, DashboardFilters, ObjectiveCard, AlertsTable } from '@biosstel/dashboard';
import { useState } from 'react';
import type { Alert } from '@biosstel/dashboard';

// Mock data - esto vendrá de la API después
const mockObjectives = [
  { title: 'Terminales (Familia X)', achieved: 12867, objective: 34560 },
  { title: 'Familia Y', achieved: 10124, objective: 89988 },
  { title: 'Familia Z', achieved: 37009, objective: 36134 },
  { title: 'Producto X', achieved: 57112, objective: 76110 },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    usuario: 'Isabelle Torres',
    departamento: 'Comercial',
    centroTrabajo: 'Barakaldo',
    rol: 'Tienda',
    estado: 'Tienda',
    statusType: 'tienda',
  },
  {
    id: '2',
    usuario: 'Maria Robledo',
    departamento: 'Comercial',
    centroTrabajo: 'Las Arenas',
    rol: 'Telemarketing',
    estado: 'Telemarketing',
    statusType: 'telemarketing',
  },
  {
    id: '3',
    usuario: 'Lucia Martinez',
    departamento: 'Comercial',
    centroTrabajo: 'Barakaldo',
    rol: 'Comercial',
    estado: 'Comercial',
    statusType: 'comercial',
  },
  {
    id: '4',
    usuario: 'Juan Pérez',
    departamento: 'Comercial',
    centroTrabajo: 'Las Arenas',
    rol: 'Comercial',
    estado: 'No ha fichado',
    statusType: 'no-fichado',
  },
  {
    id: '5',
    usuario: 'Ana García',
    departamento: 'Telemarketing',
    centroTrabajo: 'Barakaldo',
    rol: 'Telemarketing',
    estado: 'Fichaje fuera de horario',
    statusType: 'fuera-horario',
  },
];

export default function HomePage() {
  const [hasFilters, setHasFilters] = useState(false);

  const handleFilterChange = (filters: Record<string, string[]>) => {
    const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);
    setHasFilters(hasActiveFilters);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1180px]">
        <h1 className="text-h1 font-bold text-gray-900 mb-6">Inicio</h1>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockObjectives.map((obj, index) => (
              <ObjectiveCard
                key={index}
                title={obj.title}
                achieved={obj.achieved}
                objective={obj.objective}
              />
            ))}
          </div>
        )}

        <AlertsTable alerts={mockAlerts} />
      </div>
    </DashboardLayout>
  );
}
