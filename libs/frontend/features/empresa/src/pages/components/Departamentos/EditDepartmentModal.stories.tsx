import type { Meta, StoryObj } from '@storybook/react';
import { EditDepartmentModal } from './EditDepartmentModal';
import type { Department } from '@biosstel/shared-types';

const meta: Meta<typeof EditDepartmentModal> = {
  component: EditDepartmentModal,
  title: 'Features/Empresa/EditDepartmentModal',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    open: { control: 'boolean' },
    onClose: { action: 'close' },
    onSuccess: { action: 'success' },
    onSubmit: { action: 'submit' },
  },
};

export default meta;

type Story = StoryObj<typeof EditDepartmentModal>;

const department: Department = {
  id: 'dept-1',
  name: 'Comercial',
  color: '#2563eb',
  code: 'C01',
  responsibleUserId: undefined,
  dateFrom: '2024-01-01',
  dateTo: undefined,
};

/** Editar departamento con todos los campos Figma (Código, Nombre, Color, Responsable, Fechas). */
export const Default: Story = {
  args: {
    open: true,
    department,
    onClose: () => {},
    onSubmit: async (id, data) => {
      console.log('EditDepartmentModal submit', id, data);
    },
  },
};

/** Sin color asignado. */
export const WithoutColor: Story = {
  args: {
    open: true,
    department: { ...department, color: undefined },
    onClose: () => {},
    onSubmit: async () => {},
  },
};

export const Closed: Story = {
  args: {
    open: false,
    department,
    onClose: () => {},
    onSubmit: async () => {},
  },
};
