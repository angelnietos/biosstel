'use client';

import { Button, Heading, Input, Modal, Stack } from '@biosstel/ui';

export interface FichajeCalendarModalProps {
  open: boolean;
  calendarName: string;
  submitting: boolean;
  onClose: () => void;
  onCalendarNameChange: (value: string) => void;
  onSubmit: () => Promise<void>;
}

export function FichajeCalendarModal({
  open,
  calendarName,
  submitting,
  onClose,
  onCalendarNameChange,
  onSubmit,
}: FichajeCalendarModalProps) {
  const handleSubmit = async () => {
    if (!calendarName.trim()) return;
    await onSubmit();
  };

  return (
    <Modal open={open} onClose={onClose} size="s" allowClose>
      <Stack gap={4}>
        <Heading level={2} className="text-lg font-semibold text-gray-900">
          Crear calendario
        </Heading>
        <Input
          name="calendar-name"
          placeholder="Nombre del calendario"
          value={calendarName}
          onChange={(e) => onCalendarNameChange(e.target.value)}
        />
        <div className="flex gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primaryLg" type="button" disabled={!calendarName.trim() || submitting} onClick={handleSubmit}>
            {submitting ? 'Creando…' : 'Crear'}
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
