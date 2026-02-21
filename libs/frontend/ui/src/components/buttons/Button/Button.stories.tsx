import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'UI/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'primaryLg', 'secondary', 'outline', 'cancelLg'],
    },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Guardar',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Cancelar',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Ver más',
    variant: 'outline',
  },
};

export const PrimaryLg: Story = {
  args: {
    children: 'Primary Large',
    variant: 'primaryLg',
  },
};

export const CancelLg: Story = {
  args: {
    children: 'Cancelar',
    variant: 'cancelLg',
  },
};

export const Loading: Story = {
  args: {
    children: 'Enviando',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Deshabilitado',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Ancho completo',
    fullWidth: true,
  },
};
