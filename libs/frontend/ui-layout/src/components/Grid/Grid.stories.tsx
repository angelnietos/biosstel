import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  component: Grid,
  title: 'UI Layout/Grid',
  tags: ['autodocs'],
  argTypes: {
    cols: { control: 'select', options: [1, 2, 3] },
    gap: { control: 'select', options: [2, 4, 6] },
  },
};

export default meta;

type Story = StoryObj<typeof Grid>;

const Cell = ({ n }: { n: number }) => (
  <div style={{ padding: 16, background: '#f3f4f6', borderRadius: 8 }}>Item {n}</div>
);

export const OneCol: Story = {
  args: {
    cols: 1,
    gap: 4,
    children: (
      <>
        <Cell n={1} />
        <Cell n={2} />
        <Cell n={3} />
      </>
    ),
  },
};

export const TwoCols: Story = {
  args: {
    cols: 2,
    gap: 4,
    children: (
      <>
        <Cell n={1} />
        <Cell n={2} />
        <Cell n={3} />
        <Cell n={4} />
      </>
    ),
  },
};

export const ThreeCols: Story = {
  args: {
    cols: 3,
    gap: 4,
    children: (
      <>
        <Cell n={1} />
        <Cell n={2} />
        <Cell n={3} />
        <Cell n={4} />
        <Cell n={5} />
        <Cell n={6} />
      </>
    ),
  },
};
