/**
 * @biosstel/dashboard - Dashboard Filters Component
 * 
 * Filter bar for dashboard with multiple dropdown filters.
 */

'use client';

import { useState, useEffect, useRef } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface DashboardFiltersProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

const FILTER_OPTIONS = {
  marca: [
    { value: 'all', label: 'Todos' },
    { value: 'marca1', label: 'Marca 1' },
    { value: 'marca2', label: 'Marca 2' },
  ],
  departamentos: [
    { value: 'all', label: 'Todos' },
    { value: 'comerciales', label: 'Comerciales' },
    { value: 'telemarketing', label: 'Telemarketing' },
    { value: 'tiendas', label: 'Tiendas' },
  ],
  centrosTrabajo: [
    { value: 'all', label: 'Todos' },
    { value: 'barakaldo', label: 'Barakaldo' },
    { value: 'las-arenas', label: 'Las Arenas' },
  ],
  usuarios: [
    { value: 'all', label: 'Todos' },
  ],
  familia: [
    { value: 'all', label: 'Todos' },
  ],
  subfamilia: [
    { value: 'all', label: 'Todos' },
  ],
  productos: [
    { value: 'all', label: 'Todos' },
  ],
  estado: [
    { value: 'all', label: 'Todos' },
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
  ],
};

export const DashboardFilters = ({ onFilterChange }: DashboardFiltersProps) => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  const handleFilterSelect = (filterKey: string, value: string) => {
    const currentValues = filters[filterKey] || [];
    let newValues: string[];
    
    if (value === 'all') {
      newValues = [];
    } else if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    const newFilters = {
      ...filters,
      [filterKey]: newValues.length > 0 ? newValues : [],
    };
    
    setFilters(newFilters);
    onFilterChange?.(newFilters);
    setOpenDropdown(null);
  };

  const getFilterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      marca: 'Marca',
      ingManual: 'Ing/manual/ON',
      departamentos: 'Departamentos',
      centrosTrabajo: 'Centros de trabajo',
      usuarios: 'Usuarios',
      familia: 'Familia',
      subfamilia: 'Subfamilia',
      productos: 'Productos',
      estado: 'Estado',
    };
    return labels[key] || key;
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-3 mb-8">
      {/* Marca */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'marca' ? null : 'marca')}
          className={`px-4 py-2 rounded-lg border ${
            filters.marca?.length > 0
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          {getFilterLabel('marca')}
          {filters.marca?.length > 0 && ` (${filters.marca.length})`}
        </button>
        {openDropdown === 'marca' && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden">
            {FILTER_OPTIONS.marca.map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect('marca', option.value)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ing/manual/ON */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'ingManual' ? null : 'ingManual')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.ingManual?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('ingManual')}
          {filters.ingManual?.length > 0 && ` (${filters.ingManual.length})`}
        </button>
        {openDropdown === 'ingManual' && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px]">
            <button
              onClick={() => handleFilterSelect('ingManual', 'all')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              Todos
            </button>
          </div>
        )}
      </div>

      {/* Departamentos */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'departamentos' ? null : 'departamentos')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.departamentos?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('departamentos')}
          {filters.departamentos?.length > 0 && ` (${filters.departamentos.length})`}
        </button>
        {openDropdown === 'departamentos' && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden">
            {FILTER_OPTIONS.departamentos.map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect('departamentos', option.value)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  filters.departamentos?.includes(option.value) ? 'bg-blue-50 font-medium' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Centros de trabajo */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'centrosTrabajo' ? null : 'centrosTrabajo')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.centrosTrabajo?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('centrosTrabajo')}
          {filters.centrosTrabajo?.length > 0 && ` (${filters.centrosTrabajo.length})`}
        </button>
        {openDropdown === 'centrosTrabajo' && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden">
            {FILTER_OPTIONS.centrosTrabajo.map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect('centrosTrabajo', option.value)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Usuarios */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'usuarios' ? null : 'usuarios')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.usuarios?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('usuarios')}
          {filters.usuarios?.length > 0 && ` (${filters.usuarios.length})`}
        </button>
      </div>

      {/* Familia */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'familia' ? null : 'familia')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.familia?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('familia')}
          {filters.familia?.length > 0 && ` (${filters.familia.length})`}
        </button>
      </div>

      {/* Subfamilia */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'subfamilia' ? null : 'subfamilia')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.subfamilia?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('subfamilia')}
          {filters.subfamilia?.length > 0 && ` (${filters.subfamilia.length})`}
        </button>
      </div>

      {/* Productos */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'productos' ? null : 'productos')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.productos?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('productos')}
          {filters.productos?.length > 0 && ` (${filters.productos.length})`}
        </button>
      </div>

      {/* Estado */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'estado' ? null : 'estado')}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
            filters.estado?.length > 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {getFilterLabel('estado')}
          {filters.estado?.length > 0 && ` (${filters.estado.length})`}
        </button>
        {openDropdown === 'estado' && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden">
            {FILTER_OPTIONS.estado.map(option => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect('estado', option.value)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFilters;
