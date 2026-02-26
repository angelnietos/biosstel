import type { Meta, StoryObj } from '@storybook/react';
import { LegendDot } from './index';

const meta: Meta<typeof LegendDot> = {
  component: LegendDot,
  title: 'UI/LegendDot',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LegendDot>;

export const Default: Story = {
  args: { color: '#22c55e', label: 'Activo' },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LegendDot color="#22c55e" label="Activo" />
      <LegendDot color="#ef4444" label="Inactivo" />
      <LegendDot color="#3b82f6" label="Pendiente" />
    </div>
  ),
};
