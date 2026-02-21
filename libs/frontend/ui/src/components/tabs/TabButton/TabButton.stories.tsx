import type { Meta, StoryObj } from '@storybook/react';
import { TabButton } from './index';

const meta: Meta<typeof TabButton> = {
  component: TabButton,
  title: 'UI/TabButton',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TabButton>;

export const Active: Story = {
  args: { active: true, children: 'Tab activo' },
};

export const Inactive: Story = {
  args: { active: false, children: 'Tab inactivo' },
};
