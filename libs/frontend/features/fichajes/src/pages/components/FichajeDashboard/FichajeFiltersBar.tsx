'use client';

import { useRef } from 'react';
import { Button, Card, Input, Stack, Text } from '@biosstel/ui';

export interface FichajeFiltersBarProps {
  filterDate: string;
  filterDepartment: string;
  showFilterPanel: boolean;
  departments: string[];
  todayLabel: string;
  dateLabel: string;
  onFilterDateChange: (value: string) => void;
  onFilterDepartmentChange: (value: string) => void;
  onToggleFilterPanel: () => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  filterPanelRef: React.RefObject<HTMLDivElement | null>;
}

const FILTER_DATE_ID = 'fichaje-filter-date';
const FILTER_DEPARTMENT_ID = 'fichaje-filter-department';

export function FichajeFiltersBar({
  filterDate,
  filterDepartment,
  showFilterPanel,
  departments,
  todayLabel,
  dateLabel,
  onFilterDateChange,
  onFilterDepartmentChange,
  onToggleFilterPanel,
  onApplyFilters,
  onClearFilters,
  filterPanelRef,
}: FichajeFiltersBarProps) {
  return (
    <Stack ref={filterPanelRef} direction="row" gap={3} align="center" className="flex-wrap shrink-0 relative">
      <Button variant="secondary" type="button" className="shrink-0" onClick={onToggleFilterPanel} aria-expanded={showFilterPanel}>
        Filtros
      </Button>
      {showFilterPanel && (
        <Card className="absolute right-0 top-full z-10 mt-2 p-4 min-w-[240px] shadow-lg border border-border-card rounded-xl">
          <Stack gap={3}>
            <Text variant="small" className="font-semibold text-gray-900">
              Filtrar por fecha y departamento
            </Text>
            <div>
              <label htmlFor={FILTER_DATE_ID} className="block text-xs font-medium text-muted mb-1">
                Fecha
              </label>
              <Input
                id={FILTER_DATE_ID}
                type="date"
                value={filterDate}
                onChange={(e) => onFilterDateChange(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor={FILTER_DEPARTMENT_ID} className="block text-xs font-medium text-muted mb-1">
                Departamento
              </label>
              <select
                id={FILTER_DEPARTMENT_ID}
                value={filterDepartment}
                onChange={(e) => onFilterDepartmentChange(e.target.value)}
                className="w-full rounded-lg border border-border-card px-3 py-2 text-sm text-gray-900 bg-white"
                aria-labelledby={FILTER_DEPARTMENT_ID}
              >
                <option value="">Todos</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <Stack direction="row" gap={2}>
              <Button variant="secondary" type="button" className="!py-1.5" onClick={onClearFilters}>
                Limpiar
              </Button>
              <Button variant="primary" type="button" className="!py-1.5" onClick={onApplyFilters}>
                Aplicar
              </Button>
            </Stack>
          </Stack>
        </Card>
      )}
      <span className="text-sm text-muted whitespace-nowrap">
        {dateLabel} / mes actual / {todayLabel}
      </span>
    </Stack>
  );
}
