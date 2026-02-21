import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  component: Stack,
  title: 'UI Layout/Stack',
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['row', 'col'] },
    gap: { control: 'select', options: [1, 2, 3, 4, 6, 8] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around'] },
  },
};

export default meta;

type Story = StoryObj<typeof Stack>;

const Box = ({ label }: { label: string }) => (
  <div style={{ padding: 8, background: '#f3f4f6', borderRadius: 4 }}>{label}</div>
);

export const Column: Story = {
  args: {
    direction: 'col',
    gap: 4,
    children: (
      <>
        <Box label="A" />
        <Box label="B" />
        <Box label="C" />
      </>
    ),
  },
};

export const Row: Story = {
  args: {
    direction: 'row',
    gap: 4,
    children: (
      <>
        <Box label="1" />
        <Box label="2" />
        <Box label="3" />
      </>
    ),
  },
};

export const Centered: Story = {
  args: {
    direction: 'col',
    gap: 4,
    align: 'center',
    justify: 'center',
    className: 'min-h-[200px] border border-dashed border-gray-300',
    children: (
      <>
        <Box label="Centrado" />
      </>
    ),
  },
};
