import type { Meta, StoryObj } from '@storybook/react';
import { ControlJornada } from './ControlJornada';

const meta: Meta<typeof ControlJornada> = {
  component: ControlJornada,
  title: 'Features/Fichajes/ControlJornada',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ControlJornada>;

export const Default: Story = {
  args: {},
};
