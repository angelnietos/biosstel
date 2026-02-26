import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  component: Text,
  title: 'UI/Text',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['body', 'small', 'muted', 'mini'] },
    as: { control: 'select', options: ['p', 'span'] },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Body: Story = {
  args: { variant: 'body', children: 'Texto body.' },
};

export const Small: Story = {
  args: { variant: 'small', children: 'Texto small.' },
};

export const Muted: Story = {
  args: { variant: 'muted', children: 'Texto muted.' },
};

export const Mini: Story = {
  args: { variant: 'mini', children: 'Texto mini.' },
};

export const AsSpan: Story = {
  args: { as: 'span', children: 'Texto como span.' },
};
