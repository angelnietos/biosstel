import type { Meta, StoryObj } from '@storybook/react';
import { ReportsPage } from './ReportsPage';

const meta: Meta<typeof ReportsPage> = {
  component: ReportsPage,
  title: 'Features/Reports/ReportsPage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ReportsPage>;

export const Default: Story = {
  args: {},
};
