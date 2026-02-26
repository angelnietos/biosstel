import type { Meta, StoryObj } from '@storybook/react';
import { Departamentos } from './Departamentos';

const meta: Meta<typeof Departamentos> = {
  component: Departamentos,
  title: 'Features/Empresa/Departamentos',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Departamentos>;

export const Default: Story = {
  args: {},
};
