import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../buttons/Button';

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'UI/Modal',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: function ModalStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Abrir modal
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <p className="text-body">Contenido del modal.</p>
        </Modal>
      </>
    );
  },
};

export const Sizes: Story = {
  render: function SizesStory() {
    const [size, setSize] = useState<'s' | 'm' | 'l'>('s');
    const [open, setOpen] = useState(false);
    return (
      <>
        <div className="flex gap-2">
          {(['s', 'm', 'l'] as const).map((s) => (
            <Button key={s} variant="secondary" onClick={() => { setSize(s); setOpen(true); }}>
              Size {s}
            </Button>
          ))}
        </div>
        <Modal open={open} onClose={() => setOpen(false)} size={size}>
          <p className="text-body">Modal size: {size}</p>
        </Modal>
      </>
    );
  },
};
