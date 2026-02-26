import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: 'UI/IconButton',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    children: '?',
    'aria-label': 'Ayuda',
  },
};

export const Disabled: Story = {
  args: {
    children: '?',
    disabled: true,
    'aria-label': 'Ayuda',
  },
};
