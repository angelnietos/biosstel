import type { Meta, StoryObj } from '@storybook/react';
import { ClockArc } from './index';

const meta: Meta<typeof ClockArc> = {
  component: ClockArc,
  title: 'UI/ClockArc',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ClockArc>;

export const Gray: Story = {
  args: { variant: 'gray', progress: 50 },
};

export const Green: Story = {
  args: { variant: 'green', progress: 75 },
};

export const Red: Story = {
  args: { variant: 'red', progress: 25 },
};
