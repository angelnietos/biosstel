/**
 * @biosstel/usuarios - UsersFilters
 * Filtros con desplegables funcionales (Departamento, Centro de Trabajo, Rol, Estado).
 */

'use client';

export interface FilterOptions {
  departments: { value: string; label: string }[];
  workCenters: { value: string; label: string }[];
  roles: { value: string; label: string }[];
}

export interface FilterValues {
  search: string;
  department: string;
  workCenter: string;
  role: string;
  status: string;
}

export const DEFAULT_FILTERS: FilterValues = {
  search: '',
  department: '',
  workCenter: '',
  role: '',
  status: '',
};

export interface UsersFiltersProps {
  filters: FilterValues;
  options: FilterOptions;
  onFilterChange: (filters: FilterValues) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

/* Estilo alineado con botones de la página (Figma): rounded-lg, h-[43px], border-border-card, font-semibold */
const filterSelectClass =
  'inline-flex h-[43px] min-h-[43px] items-center gap-2 pl-4 pr-9 py-0 bg-white border border-border-card rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer appearance-none bg-no-repeat bg-[length:12px_12px] bg-[right_0.75rem_center] min-w-[160px] max-w-[180px]';

const chevronSvg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  ariaLabel: string;
}) {
  const hasEmptyOption = options.some((o) => o.value === '');
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={filterSelectClass}
      style={{ backgroundImage: chevronSvg }}
      aria-label={ariaLabel}
    >
      {!hasEmptyOption && (
        <option value="" className="text-muted">
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value || '__empty__'} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export const UsersFilters = ({ filters, options, onFilterChange }: UsersFiltersProps) => {
  const update = (key: keyof FilterValues, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Buscador: mismo estilo que filtros (rounded-lg, h-43) */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscador de los elementos contenidos en la tabla"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="w-full h-[43px] min-h-[43px] pl-10 pr-4 py-2.5 bg-white border border-border-card rounded-lg text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
        />
      </div>

      <FilterSelect
        value={filters.department}
        onChange={(v) => update('department', v)}
        options={options.departments}
        placeholder="Departamento"
        ariaLabel="Filtrar por departamento"
      />

      <FilterSelect
        value={filters.workCenter}
        onChange={(v) => update('workCenter', v)}
        options={options.workCenters}
        placeholder="Centro de Trabajo"
        ariaLabel="Filtrar por centro de trabajo"
      />

      <FilterSelect
        value={filters.role}
        onChange={(v) => update('role', v)}
        options={options.roles}
        placeholder="Rol"
        ariaLabel="Filtrar por rol"
      />

      <FilterSelect
        value={filters.status}
        onChange={(v) => update('status', v)}
        options={STATUS_OPTIONS}
        placeholder="Estado"
        ariaLabel="Filtrar por estado"
      />
    </div>
  );
};
