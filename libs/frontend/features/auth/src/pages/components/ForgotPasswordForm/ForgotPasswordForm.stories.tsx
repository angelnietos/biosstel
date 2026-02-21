import type { Meta, StoryObj } from '@storybook/react';
import { ForgotPasswordForm } from './ForgotPasswordForm';

const meta: Meta<typeof ForgotPasswordForm> = {
  component: ForgotPasswordForm,
  title: 'Features/Auth/ForgotPasswordForm',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof ForgotPasswordForm>;

export const Default: Story = {
  args: {
    onSubmit: async (values) => {
      console.log('Submit', values);
    },
  },
};
