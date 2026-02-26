'use client';

import { Dropdown, DateInput } from '@biosstel/ui';

export interface FilterBarValues {
  marca?: string;
  dateFrom?: Date;
  dateTo?: Date;
  departamentos?: string;
  centrosTrabajo?: string;
  usuarios?: string;
  familia?: string;
  subfamilia?: string;
  productos?: string;
  estado?: string;
}

interface Props {
  values: FilterBarValues;
  onChange: (values: FilterBarValues) => void;
  options: {
    marca: Array<{ label: string; value: string }>;
    departamentos: Array<{ label: string; value: string }>;
    centrosTrabajo: Array<{ label: string; value: string }>;
    usuarios: Array<{ label: string; value: string }>;
    familia: Array<{ label: string; value: string }>;
    subfamilia: Array<{ label: string; value: string }>;
    productos: Array<{ label: string; value: string }>;
    estado: Array<{ label: string; value: string }>;
  };
}

export const FilterBar = ({ values, onChange, options }: Props) => {
  const handleChange = (key: keyof FilterBarValues, value: string | Date | undefined) => {
    onChange({ ...values, [key]: value });
  };

  const labelClass = 'text-xs font-medium text-muted whitespace-nowrap block mb-1';

  return (
    <div className="rounded-xl border border-border-card bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900 mb-3">Filtrar por</p>
      <div className="flex w-full flex-wrap gap-x-4 gap-y-4 items-end">
        <div className="flex flex-col">
          <label className={labelClass}>Marca</label>
          <Dropdown
            name="marca"
            value={values.marca ?? 'all'}
            onChange={(v) => handleChange('marca', v)}
            options={options.marca}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>De</label>
          <DateInput
            name="dateFrom"
            value={values.dateFrom}
            onChange={(v) => handleChange('dateFrom', v)}
            placeholder="dd/mm/aa"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>A</label>
          <DateInput
            name="dateTo"
            value={values.dateTo}
            onChange={(v) => handleChange('dateTo', v)}
            placeholder="dd/mm/aa"
          />
        </div>
        <div className="hidden h-8 w-px bg-border-card lg:block self-center" />
        <div className="flex flex-col">
          <label className={labelClass}>Departamentos</label>
          <Dropdown
            name="departamentos"
            value={values.departamentos ?? 'all'}
            onChange={(v) => handleChange('departamentos', v)}
            options={options.departamentos}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>Centros de trabajo</label>
          <Dropdown
            name="centrosTrabajo"
            value={values.centrosTrabajo ?? 'all'}
            onChange={(v) => handleChange('centrosTrabajo', v)}
            options={options.centrosTrabajo}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>Usuarios</label>
          <Dropdown
            name="usuarios"
            value={values.usuarios ?? 'all'}
            onChange={(v) => handleChange('usuarios', v)}
            options={options.usuarios}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>Familia</label>
          <Dropdown
            name="familia"
            value={values.familia ?? 'all'}
            onChange={(v) => handleChange('familia', v)}
            options={options.familia}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>Subfamilia</label>
          <Dropdown
            name="subfamilia"
            value={values.subfamilia ?? 'all'}
            onChange={(v) => handleChange('subfamilia', v)}
            options={options.subfamilia}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>Productos</label>
          <Dropdown
            name="productos"
            value={values.productos ?? 'all'}
            onChange={(v) => handleChange('productos', v)}
            options={options.productos}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>Estado</label>
          <Dropdown
            name="estado"
            value={values.estado ?? 'all'}
            onChange={(v) => handleChange('estado', v)}
            options={options.estado}
            placeholder="Todos"
            className="min-w-[140px]"
          />
        </div>
      </div>
    </div>
  );
};
