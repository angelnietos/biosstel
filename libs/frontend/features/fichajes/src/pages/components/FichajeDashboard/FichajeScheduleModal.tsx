'use client';

import { Button, Heading, Input, Modal, Stack } from '@biosstel/ui';
import type { ScheduleItem } from './utils';

const EMPTY_SCHEDULE: Omit<ScheduleItem, 'id' | 'name'> & { name: string } = {
  name: '',
  hoursPerYear: 0,
  vacationDays: 0,
  freeDisposalDays: 0,
  hoursPerDayWeekdays: 0,
  hoursPerDaySaturday: 0,
  hoursPerWeek: 0,
};

export interface FichajeScheduleModalProps {
  open: boolean;
  form: ScheduleItem & { name: string };
  submitting: boolean;
  onClose: () => void;
  onFormChange: (updates: Partial<ScheduleItem & { name: string }>) => void;
  onSubmit: () => Promise<void>;
}

export function FichajeScheduleModal({ open, form, submitting, onClose, onFormChange, onSubmit }: FichajeScheduleModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="m" allowClose>
      <Stack gap={4}>
        <Heading level={2} className="text-lg font-semibold text-gray-900">
          Nuevo Horario laboral
        </Heading>
        <Input
          name="schedule-name"
          label="Nombre del horario laboral"
          value={form.name}
          onChange={(e) => onFormChange({ name: e.target.value })}
          placeholder="Ej. Jornada estándar"
        />
        <Input
          name="schedule-hours-year"
          type="number"
          label="No. de horas anuales"
          value={String(form.hoursPerYear)}
          onChange={(e) => onFormChange({ hoursPerYear: Number(e.target.value) || 0 })}
        />
        <Input
          name="schedule-vacation"
          type="number"
          label="Vacaciones (días laborales)"
          value={String(form.vacationDays)}
          onChange={(e) => onFormChange({ vacationDays: Number(e.target.value) || 0 })}
        />
        <Input
          name="schedule-free-disposal"
          type="number"
          label="Días de libre disposición (días laborales)"
          value={String(form.freeDisposalDays)}
          onChange={(e) => onFormChange({ freeDisposalDays: Number(e.target.value) || 0 })}
        />
        <Input
          name="schedule-hours-weekdays"
          type="number"
          label="Horas por día Lunes-Viernes"
          value={String(form.hoursPerDayWeekdays)}
          onChange={(e) => onFormChange({ hoursPerDayWeekdays: Number(e.target.value) || 0 })}
        />
        <Input
          name="schedule-hours-saturday"
          type="number"
          label="Horas por día Sábado"
          value={String(form.hoursPerDaySaturday)}
          onChange={(e) => onFormChange({ hoursPerDaySaturday: Number(e.target.value) || 0 })}
        />
        <Input
          name="schedule-hours-week"
          type="number"
          label="Horas por semana"
          value={String(form.hoursPerWeek)}
          onChange={(e) => onFormChange({ hoursPerWeek: Number(e.target.value) || 0 })}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="button" disabled={!form.name.trim() || submitting} onClick={onSubmit}>
            {submitting ? 'Creando…' : 'Crear'}
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
