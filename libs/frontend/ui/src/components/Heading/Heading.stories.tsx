import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  component: Heading,
  title: 'UI/Heading',
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: [1, 2, 3] },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: { level: 1, children: 'Título principal' },
};

export const H2: Story = {
  args: { level: 2, children: 'Subtítulo' },
};

export const H3: Story = {
  args: { level: 3, children: 'Sección' },
};
