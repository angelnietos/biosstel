import type { Meta, StoryObj } from '@storybook/react';
import { AddDepartmentModal } from './AddDepartmentModal';

const meta: Meta<typeof AddDepartmentModal> = {
  component: AddDepartmentModal,
  title: 'Shared/AddDepartmentModal',
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

type Story = StoryObj<typeof AddDepartmentModal>;

/** Figma Base-15: Código, Nombre departamento, Color, Responsable, Fecha alta, Fecha baja. Cancelar / Añadir. */
export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    onSubmit: async (data) => {
      console.log('AddDepartmentModal submit', data);
    },
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    onSubmit: async () => {},
  },
};
