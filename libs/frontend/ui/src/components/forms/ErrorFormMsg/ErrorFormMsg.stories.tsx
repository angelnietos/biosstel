import type { Meta, StoryObj } from '@storybook/react';
import { ErrorFormMsg } from './ErrorFormMsg';

const meta: Meta<typeof ErrorFormMsg> = {
  component: ErrorFormMsg,
  title: 'UI/ErrorFormMsg',
  tags: ['autodocs'],
  argTypes: {
    errorMsg: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorFormMsg>;

export const WithError: Story = {
  args: {
    errorMsg: 'Este campo es obligatorio',
  },
};

export const Hidden: Story = {
  args: {
    errorMsg: undefined,
  },
};

export const LongMessage: Story = {
  args: {
    errorMsg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.',
  },
};
