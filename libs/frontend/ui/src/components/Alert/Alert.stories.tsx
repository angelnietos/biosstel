import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: 'UI/Alert',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['error', 'success', 'info'] },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Error: Story = {
  args: { variant: 'error', children: 'Mensaje de error.' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Operación correcta.' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'Información.' },
};
