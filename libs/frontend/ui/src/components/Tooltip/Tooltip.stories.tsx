import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../buttons/Button';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'UI/Tooltip',
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    content: 'Texto del tooltip',
    placement: 'top',
    children: <span className="underline decoration-dotted">Pasa el cursor aquí</span>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip abajo',
    placement: 'bottom',
    children: (
      <button type="button" className="px-3 py-1 bg-gray-200 rounded">
        Hover
      </button>
    ),
  },
};

export const WithButton: Story = {
  args: {
    content: 'Guardar cambios',
    placement: 'top',
    children: <Button variant="primary">Guardar</Button>,
  },
};

export const AllPlacements: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <Tooltip content="Arriba" placement="top">
        <span className="px-3 py-1 bg-gray-200 rounded cursor-default">Top</span>
      </Tooltip>
      <div className="flex gap-8">
        <Tooltip content="Izquierda" placement="left">
          <span className="px-3 py-1 bg-gray-200 rounded cursor-default">Left</span>
        </Tooltip>
        <Tooltip content="Derecha" placement="right">
          <span className="px-3 py-1 bg-gray-200 rounded cursor-default">Right</span>
        </Tooltip>
      </div>
      <Tooltip content="Abajo" placement="bottom">
        <span className="px-3 py-1 bg-gray-200 rounded cursor-default">Bottom</span>
      </Tooltip>
    </div>
  ),
};
