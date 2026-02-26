import type { Meta, StoryObj } from '@storybook/react';
import { DetalleUsuario } from './DetalleUsuario';

const meta: Meta<typeof DetalleUsuario> = {
  component: DetalleUsuario,
  title: 'Features/Usuarios/DetalleUsuario',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    userId: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof DetalleUsuario>;

/** Figma Base-20: Detalle Usuario, flecha atrás, datos (Nombre, Email, Departamento, Centro de trabajo, Rol, Estado), pestañas Datos / Documentación. */
export const Default: Story = {
  args: {
    userId: 'user-1',
  },
};

/** Sin userId (estado vacío). */
export const NoUserSelected: Story = {
  args: {},
};
