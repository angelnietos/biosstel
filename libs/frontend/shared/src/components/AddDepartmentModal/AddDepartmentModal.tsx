/**
 * @biosstel/shared - Modal Añadir Departamento (presentacional)
 * Recibe onSubmit para que cada feature inyecte su API (empresa.createDepartment).
 */

'use client';

import { useState } from 'react';
import { Modal, Button, Input, Heading, Text } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { AddDepartmentFormData } from '../../types/addDepartmentForm';

export interface AddDepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** La feature (empresa/usuarios) pasa la función que llama a createDepartment */
  onSubmit: (data: AddDepartmentFormData) => Promise<void>;
}

export const AddDepartmentModal = ({ open, onClose, onSuccess, onSubmit }: AddDepartmentModalProps) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const data: AddDepartmentFormData = {
        code: code.trim() || undefined,
        name: name.trim(),
        color: color.trim() || undefined,
        responsibleUserId: responsible.trim() || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };
      await onSubmit(data);
      setCode('');
      setName('');
      setColor('');
      setResponsible('');
      setDateFrom('');
      setDateTo('');
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear departamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="m">
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Heading level={2} className="text-gray-900 font-bold">Añadir Departamento</Heading>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Opcional" className="w-full border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre departamento</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Comercial" required className="w-full border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color (hex)</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={color || '#6b7280'}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded border border-border-card cursor-pointer"
              />
              <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#hex o vacío" className="flex-1 border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable (ID usuario)</label>
            <Input value={responsible} onChange={(e) => setResponsible(e.target.value)} placeholder="Opcional" className="w-full border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha alta</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha baja</label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="dd/mm/aaaa" className="w-full border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="min-h-[43px] px-5">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading || !name.trim()} className="min-h-[43px] px-5">
              {loading ? 'Guardando…' : 'Añadir'}
            </Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
};
