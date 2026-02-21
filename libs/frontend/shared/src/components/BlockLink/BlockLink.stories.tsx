import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BlockLink } from './BlockLink';
import { Card } from '@biosstel/ui';

const meta: Meta<typeof BlockLink> = {
  component: BlockLink,
  title: 'Shared/BlockLink',
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof BlockLink>;

export const Default: Story = {
  args: {
    href: '/example',
    children: 'Enlace de bloque (sin estilo de texto)',
  },
};

export const WrappingCard: Story = {
  render: () => (
    <BlockLink href="/objetivo/1">
      <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow max-w-xs">
        <strong>Objetivo ejemplo</strong>
        <p style={{ marginTop: 8, fontSize: 14, color: '#6b7280' }}>120 / 100 unidades</p>
      </Card>
    </BlockLink>
  ),
};
