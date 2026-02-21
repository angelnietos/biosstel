import type { Meta, StoryObj } from '@storybook/react';
import { DepartmentBadge } from './index';

const meta: Meta<typeof DepartmentBadge> = {
  component: DepartmentBadge,
  title: 'UI/DepartmentBadge',
};

export default meta;

type Story = StoryObj<typeof DepartmentBadge>;

export const Default: Story = {
  args: {
    label: 'Ventas',
    textClass: 'text-gray-800',
    bgClass: 'bg-gray-200',
  },
};

export const Green: Story = {
  args: {
    label: 'Producción',
    textClass: 'text-green-800',
    bgClass: 'bg-green-200',
  },
};

export const Blue: Story = {
  args: {
    label: 'RRHH',
    textClass: 'text-blue-800',
    bgClass: 'bg-blue-200',
  },
};
