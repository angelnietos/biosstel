import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonLink } from './ButtonLink';

const meta: Meta<typeof ButtonLink> = {
  component: ButtonLink,
  title: 'Shared/ButtonLink',
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonLink>;

export const Default: Story = {
  args: {
    href: '/add-user',
    children: 'Añadir Usuario +',
  },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <ButtonLink href="/add-user">Añadir Usuario +</ButtonLink>
      <ButtonLink href="/centros-trabajo">Añadir Punto de venta +</ButtonLink>
      <ButtonLink href="/departamentos">Añadir Departamento +</ButtonLink>
    </div>
  ),
};
