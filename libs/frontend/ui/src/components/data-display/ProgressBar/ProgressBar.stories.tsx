import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  title: 'UI/ProgressBar',
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    max: { control: { type: 'number' } },
    variant: { control: 'select', options: ['default', 'success', 'error'] },
    showLabel: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { value: 60, max: 100 },
};

export const WithLabel: Story = {
  args: { value: 75, max: 100, showLabel: true },
};

export const Success: Story = {
  args: { value: 100, variant: 'success', showLabel: true },
};

export const Error: Story = {
  args: { value: 25, variant: 'error', showLabel: true },
};

export const CustomMax: Story = {
  args: { value: 80, max: 200, showLabel: true },
};
