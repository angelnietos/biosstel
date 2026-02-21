import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  component: StatusBadge,
  title: 'UI/StatusBadge',
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['success', 'warning', 'error', 'muted'] },
    label: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Success: Story = {
  args: { status: 'success', label: 'Fichado' },
};

export const Warning: Story = {
  args: { status: 'warning', label: 'Pausado' },
};

export const Error: Story = {
  args: { status: 'error', label: 'Error' },
};

export const Muted: Story = {
  args: { status: 'muted', label: 'Inactivo' },
};

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <StatusBadge status="success" label="Fichado" />
      <StatusBadge status="warning" label="Pausado" />
      <StatusBadge status="error" label="Error" />
      <StatusBadge status="muted" label="Inactivo" />
    </div>
  ),
};
