import type { Meta, StoryObj } from '@storybook/react';
import { ObjectiveCard } from './ObjectiveCard';

const meta: Meta<typeof ObjectiveCard> = {
  component: ObjectiveCard,
  title: 'Features/Objetivos/ObjectiveCard',
  tags: ['autodocs'],
  argTypes: {
    accent: {
      control: 'select',
      options: ['maroon', 'teal', 'blue', 'purple', 'magenta'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ObjectiveCard>;

export const Default: Story = {
  args: {
    title: 'Ventas',
    achieved: 75,
    objective: 100,
    unit: '€',
    accent: 'blue',
  },
};

export const Teal: Story = {
  args: {
    title: 'Objetivo cumplido',
    achieved: 100,
    objective: 100,
    unit: '%',
    accent: 'teal',
  },
};

export const WithLink: Story = {
  args: {
    title: 'Ver detalle',
    achieved: 50,
    objective: 100,
    href: '#',
    accent: 'purple',
  },
};
