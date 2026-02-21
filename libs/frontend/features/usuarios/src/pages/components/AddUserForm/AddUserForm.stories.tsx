import type { Meta, StoryObj } from '@storybook/react';
import { AddUserForm } from './AddUserForm';

const meta: Meta<typeof AddUserForm> = {
  component: AddUserForm,
  title: 'Features/Usuarios/AddUserForm',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof AddUserForm>;

export const Default: Story = {
  args: {},
};
