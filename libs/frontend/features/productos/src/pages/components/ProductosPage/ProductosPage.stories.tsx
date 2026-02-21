import type { Meta, StoryObj } from '@storybook/react';
import { ProductosPage } from './ProductosPage';

const defaultPaths = {
  inventory: '/inventory',
  newProduct: '/productos/nuevo',
};

const meta: Meta<typeof ProductosPage> = {
  component: ProductosPage,
  title: 'Features/Productos/ProductosPage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ProductosPage>;

export const Default: Story = {
  args: {
    paths: defaultPaths,
  },
};
