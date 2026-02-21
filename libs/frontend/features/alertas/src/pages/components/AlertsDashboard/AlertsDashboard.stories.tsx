import type { Meta, StoryObj } from '@storybook/react';
import { AlertsDashboard } from './AlertsDashboard';

const meta: Meta<typeof AlertsDashboard> = {
  component: AlertsDashboard,
  title: 'Features/Alertas/AlertsDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AlertsDashboard>;

export const Default: Story = {
  args: {},
};
