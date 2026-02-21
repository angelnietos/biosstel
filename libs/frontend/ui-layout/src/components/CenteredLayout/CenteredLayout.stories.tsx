import type { Meta, StoryObj } from '@storybook/react';
import { CenteredLayout } from './CenteredLayout';

const meta: Meta<typeof CenteredLayout> = {
  component: CenteredLayout,
  title: 'UI Layout/CenteredLayout',
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof CenteredLayout>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: 24, background: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        Contenido centrado (ej. formulario de login).
      </div>
    ),
  },
};

export const Narrow: Story = {
  args: {
    maxWidth: 'max-w-sm',
    children: (
      <div style={{ padding: 24, background: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        Ancho máximo reducido (max-w-sm).
      </div>
    ),
  },
};
