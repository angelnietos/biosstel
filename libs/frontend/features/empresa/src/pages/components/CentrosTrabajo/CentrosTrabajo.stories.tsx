import type { Meta, StoryObj } from '@storybook/react';
import { CentrosTrabajo } from './CentrosTrabajo';

const meta: Meta<typeof CentrosTrabajo> = {
  component: CentrosTrabajo,
  title: 'Features/Empresa/CentrosTrabajo',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof CentrosTrabajo>;

export const Default: Story = {
  args: {},
};
