import type { Meta, StoryObj } from '@storybook/react';
import { TelemarketingAgenda } from './TelemarketingAgenda';

const meta: Meta<typeof TelemarketingAgenda> = {
  component: TelemarketingAgenda,
  title: 'Features/Operaciones/TelemarketingAgenda',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof TelemarketingAgenda>;

export const Default: Story = {
  args: {},
};
