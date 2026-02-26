/**
 * Modal para crear o editar una tarea de agenda (telemarketing).
 */
'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { TareaAgenda } from '@biosstel/shared-types';

const ESTADO_OPTIONS = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'En curso', value: 'en curso' },
  { label: 'Completada', value: 'completada' },
];

export interface TareaFormModalProps {
  open: boolean;
  onClose: () => void;
  tarea?: TareaAgenda | null;
  onSubmit: (payload: { id?: string; tarea: string; cliente: string; estado: string }) => void;
}

export function TareaFormModal({ open, onClose, tarea, onSubmit }: TareaFormModalProps) {
  const [tareaVal, setTareaVal] = useState('');
  const [cliente, setCliente] = useState('');
  const [estado, setEstado] = useState('pendiente');

  useEffect(() => {
    if (open) {
      setTareaVal(tarea?.tarea ?? '');
      setCliente(tarea?.cliente ?? '');
      setEstado(tarea?.estado ?? 'pendiente');
    }
  }, [open, tarea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tareaVal.trim()) return;
    onSubmit(
      tarea
        ? { id: tarea.id, tarea: tareaVal.trim(), cliente: cliente.trim(), estado }
        : { tarea: tareaVal.trim(), cliente: cliente.trim(), estado }
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="m">
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <h2 className="text-lg font-semibold text-gray-900">
            {tarea ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <Input
            label="Tarea"
            value={tareaVal}
            onChange={(e) => setTareaVal(e.target.value)}
            required
            placeholder="Descripción de la tarea"
          />
          <Input
            label="Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Cliente asociado"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <Select
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              options={ESTADO_OPTIONS}
              className="w-full border border-border-card rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {tarea ? 'Guardar' : 'Crear tarea'}
            </Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
}
