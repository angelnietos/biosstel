import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BasicSelect } from './index';

const meta: Meta<typeof BasicSelect> = {
  component: BasicSelect,
  title: 'UI/BasicSelect',
};

export default meta;

type Story = StoryObj<typeof BasicSelect>;

const options = [
  { id: 1, value: 'Opción A' },
  { id: 2, value: 'Opción B' },
  { id: 3, value: 'Opción C' },
];

export const Default: Story = {
  render: function BasicSelectStory() {
    const [value, setValue] = useState(1);
    return (
      <BasicSelect
        htmlFor="basic-select"
        name="basic-select"
        value={value}
        optionsArray={options}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    );
  },
};
