import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { Button } from '../buttons/Button';

const meta: Meta<typeof ConfirmModal> = {
  component: ConfirmModal,
  title: 'UI/ConfirmModal',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {
  render: function ConfirmModalStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Abrir confirmación
        </Button>
        <ConfirmModal
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Confirmar"
          description="¿Estás seguro de que quieres continuar?"
          confirmLabel="Sí"
          cancelLabel="No"
        />
      </>
    );
  },
};
