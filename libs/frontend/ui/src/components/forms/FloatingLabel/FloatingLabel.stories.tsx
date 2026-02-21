import type { Meta, StoryObj } from '@storybook/react';
import { FloatingLabel } from './FloatingLabel';

const meta: Meta<typeof FloatingLabel> = {
  component: FloatingLabel,
  title: 'UI/FloatingLabel',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FloatingLabel>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};
