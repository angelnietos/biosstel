/**
 * Modal para crear o editar una visita comercial.
 */
'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { VisitaComercial } from '@biosstel/shared-types';

const TIPO_OPTIONS = [
  { label: 'Nueva', value: 'nueva' },
  { label: 'Seguimiento', value: 'seguimiento' },
];

export interface VisitaFormModalProps {
  open: boolean;
  onClose: () => void;
  visita?: VisitaComercial | null;
  onSubmit: (payload: { id?: string; cliente: string; tipo: 'nueva' | 'seguimiento'; fecha: string }) => void;
}

export function VisitaFormModal({ open, onClose, visita, onSubmit }: VisitaFormModalProps) {
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState<'nueva' | 'seguimiento'>('nueva');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    if (open) {
      setCliente(visita?.cliente ?? '');
      setTipo(visita?.tipo ?? 'nueva');
      setFecha(visita?.fecha ?? new Date().toISOString().slice(0, 10));
    }
  }, [open, visita]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente.trim() || !fecha.trim()) return;
    onSubmit(visita ? { id: visita.id, cliente: cliente.trim(), tipo, fecha: fecha.trim() } : { cliente: cliente.trim(), tipo, fecha: fecha.trim() });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="m">
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <h2 className="text-lg font-semibold text-gray-900">
            {visita ? 'Editar visita' : 'Nueva visita'}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <Input
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
              placeholder="Nombre del cliente"
              className="w-full border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <Select
              name="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'nueva' | 'seguimiento')}
              options={TIPO_OPTIONS}
              className="w-full border border-border-card rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full border border-border-card rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {visita ? 'Guardar' : 'Crear visita'}
            </Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
}
