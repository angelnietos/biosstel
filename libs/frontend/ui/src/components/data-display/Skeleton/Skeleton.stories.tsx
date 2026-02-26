import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: 'UI/Skeleton',
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Small: Story = {
  args: { height: 'sm' },
};

export const Medium: Story = {
  args: { height: 'md' },
};

export const Large: Story = {
  args: { height: 'lg' },
};

export const WithWidth: Story = {
  args: { height: 'md', className: 'w-64' },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ width: 280, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <Skeleton height="sm" className="w-3/4 mb-4" />
      <Skeleton height="lg" className="w-full mb-2" />
      <Skeleton height="sm" className="w-full" />
    </div>
  ),
};
