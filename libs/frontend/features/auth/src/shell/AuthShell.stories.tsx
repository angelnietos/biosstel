import type { Meta, StoryObj } from '@storybook/react';
import { AuthShell } from './AuthShell';

const meta: Meta<typeof AuthShell> = {
  component: AuthShell,
  title: 'Features/Auth/AuthShell',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof AuthShell>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: 24 }}>Contenido de ejemplo</div>,
  },
};
