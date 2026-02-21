import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  component: NumberInput,
  title: 'UI/NumberInput',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: function NumberInputStory() {
    const [value, setValue] = useState(0);
    return <NumberInput value={value} onChange={setValue} />;
  },
};

export const WithMinMax: Story = {
  render: function NumberInputStory() {
    const [value, setValue] = useState(5);
    return <NumberInput value={value} onChange={setValue} min={0} max={10} />;
  },
};
