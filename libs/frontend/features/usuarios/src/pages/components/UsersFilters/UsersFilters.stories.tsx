import type { Meta, StoryObj } from '@storybook/react';
import { UsersFilters, DEFAULT_FILTERS, type FilterOptions } from './UsersFilters';

const meta: Meta<typeof UsersFilters> = {
  component: UsersFilters,
  title: 'Features/Usuarios/UsersFilters',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    onFilterChange: { action: 'filterChange' },
  },
};

export default meta;

type Story = StoryObj<typeof UsersFilters>;

const options: FilterOptions = {
  departments: [
    { value: '', label: 'Departamento' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Telemarketing', label: 'Telemarketing' },
    { value: 'Tienda', label: 'Tienda' },
  ],
  workCenters: [
    { value: '', label: 'Centro de Trabajo' },
    { value: 'Barakaldo', label: 'Barakaldo' },
    { value: 'Las Arenas', label: 'Las Arenas' },
  ],
  roles: [
    { value: '', label: 'Rol' },
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'COMERCIAL', label: 'Comercial' },
    { value: 'TELEMARKETING', label: 'Telemarketing' },
  ],
};

/** Figma: Buscador "Buscador de los elementos contenidos en la tabla", filtros Departamento, Centro de Trabajo, Rol, Estado. */
export const Default: Story = {
  args: {
    filters: DEFAULT_FILTERS,
    options,
    onFilterChange: () => {},
  },
};

export const WithValues: Story = {
  args: {
    filters: {
      ...DEFAULT_FILTERS,
      search: 'Juan',
      department: 'Comercial',
      role: 'COMERCIAL',
      status: 'active',
    },
    options,
    onFilterChange: () => {},
  },
};
