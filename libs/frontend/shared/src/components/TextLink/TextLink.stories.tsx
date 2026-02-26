import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextLink } from './TextLink';

const meta: Meta<typeof TextLink> = {
  component: TextLink,
  title: 'Shared/TextLink',
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof TextLink>;

export const Default: Story = {
  args: {
    href: '/example',
    children: 'Enlace de texto',
  },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <TextLink href="/tareas">Tareas pendientes</TextLink>
      <TextLink href="/objetivos">Objetivos</TextLink>
      <TextLink href="/fichajes">Fichajes</TextLink>
    </div>
  ),
};
