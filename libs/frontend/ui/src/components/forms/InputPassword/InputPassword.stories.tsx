import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { InputPassword } from './InputPassword';

const meta: Meta<typeof InputPassword> = {
  component: InputPassword,
  title: 'UI/InputPassword',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof InputPassword>;

export const Default: Story = {
  render: function InputPasswordStory() {
    const [value, setValue] = useState('');
    return (
      <div className="w-full max-w-sm">
        <InputPassword
          name="password"
          placeholder="Contraseña"
          label="Contraseña"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: function InputPasswordStory() {
    const [value, setValue] = useState('');
    return (
      <div className="w-full max-w-sm">
        <InputPassword
          name="password"
          placeholder="Contraseña"
          label="Contraseña"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error
        />
      </div>
    );
  },
};
