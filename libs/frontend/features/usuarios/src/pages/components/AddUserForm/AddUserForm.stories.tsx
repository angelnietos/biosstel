import type { Meta, StoryObj } from '@storybook/react';
import { AddUserForm } from './AddUserForm';

const meta: Meta<typeof AddUserForm> = {
  component: AddUserForm,
  title: 'Features/Usuarios/AddUserForm',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: { action: 'submit' },
    cancelHref: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof AddUserForm>;

/** Figma Base-5: Nombre, Contraseña x2, Rol, Nombre Apellidos, Departamento, Centro de trabajo, Teléfono. Botón Añadir. */
export const Default: Story = {
  args: {
    cancelHref: '/users',
    onSubmit: async (values) => {
      console.log('AddUserForm submit', values);
    },
  },
};

/** Sin ruta de cancelar (ej. en modal o flujo sin vuelta). */
export const WithoutCancelLink: Story = {
  args: {
    onSubmit: async (values) => {
      console.log('AddUserForm submit', values);
    },
  },
};
