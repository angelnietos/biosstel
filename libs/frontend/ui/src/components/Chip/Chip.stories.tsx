import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  component: Chip,
  title: 'UI/Chip',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
    children: { control: 'text' },
    onRemove: { action: 'removed' },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: 'Etiqueta',
    variant: 'default',
  },
};

export const Success: Story = {
  args: {
    children: 'Completado',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Pendiente',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
  },
};

export const Removable: Story = {
  args: {
    children: 'Filtro activo',
    onRemove: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="default">Default</Chip>
      <Chip variant="success">Success</Chip>
      <Chip variant="warning">Warning</Chip>
      <Chip variant="error">Error</Chip>
      <Chip variant="default" onRemove={() => {}}>
        Removable
      </Chip>
    </div>
  ),
};
