import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'UI/Card',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'Contenido de la card.',
  },
};

export const WithPadding: Story = {
  args: {
    className: 'p-6',
    children: 'Contenido con padding (className="p-6").',
  },
};
