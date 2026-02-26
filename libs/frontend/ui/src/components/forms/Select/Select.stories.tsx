import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'UI/Select',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Select>;

const options = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
  { value: 'c', label: 'Opción C' },
];

export const Default: Story = {
  args: {
    name: 'select',
    options,
    placeholder: 'Seleccionar...',
  },
};

export const WithValue: Story = {
  args: {
    name: 'select',
    options,
    value: 'b',
    placeholder: 'Seleccionar...',
  },
};

export const Error: Story = {
  args: {
    name: 'select',
    options,
    error: true,
    placeholder: 'Seleccionar...',
  },
};
