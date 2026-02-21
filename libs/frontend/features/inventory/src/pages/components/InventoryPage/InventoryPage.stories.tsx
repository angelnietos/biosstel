import type { Meta, StoryObj } from '@storybook/react';
import { InventoryPage } from './InventoryPage';

const meta: Meta<typeof InventoryPage> = {
  component: InventoryPage,
  title: 'Features/Inventory/InventoryPage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof InventoryPage>;

export const Default: Story = {
  args: {},
};
