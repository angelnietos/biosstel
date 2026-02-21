import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'UI/Input',
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    name: 'email',
    placeholder: 'Correo electrónico',
  },
};

export const WithValue: Story = {
  args: {
    name: 'username',
    placeholder: 'Usuario',
    value: 'admin@biosstel.com',
  },
};

export const Error: Story = {
  args: {
    name: 'password',
    placeholder: 'Contraseña',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'readonly',
    placeholder: 'Solo lectura',
    disabled: true,
    value: 'No editable',
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'readonly',
    placeholder: 'Solo lectura',
    readOnly: true,
    value: 'Valor fijo',
  },
};
