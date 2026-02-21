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
        responsibleUserId: responsible.trim() || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };
      await onSubmit(data);
      setCode('');
      setName('');
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
          <Input
            label="Código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Opcional"
          />
          <Input
            label="Nombre departamento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Comercial"
            required
          />
          <Input
            label="Responsable (ID usuario)"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            placeholder="Opcional"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha alta"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              label="Fecha baja"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="dd/mm/aaaa"
            />
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
