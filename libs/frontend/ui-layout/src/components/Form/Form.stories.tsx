import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

const meta: Meta<typeof Form> = {
  component: Form,
  title: 'UI Layout/Form',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  args: {
    onSubmit: (e) => e.preventDefault(),
    children: (
      <>
        <label style={{ display: 'block', marginBottom: 8 }}>Campo</label>
        <input type="text" style={{ padding: 8, marginBottom: 16 }} />
        <button type="submit">Enviar</button>
      </>
    ),
  },
};
