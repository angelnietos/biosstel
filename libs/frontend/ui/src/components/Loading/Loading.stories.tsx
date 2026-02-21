import type { Meta, StoryObj } from '@storybook/react';
import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
  component: Loading,
  title: 'UI/Loading',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const FullHeight: Story = {
  args: {},
};

export const HeightFit: Story = {
  args: { isHeightFit: true },
};
