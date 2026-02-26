/**
 * Modal para editar departamento (Figma Base-15: Código, Nombre, Responsable, Fecha alta/baja, Color).
 */
'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { Department } from '@biosstel/shared-types';
import type { UpdateDepartmentData } from '@biosstel/shared';

export interface EditDepartmentModalProps {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  onSuccess?: () => void;
  onSubmit: (id: string, data: UpdateDepartmentData) => Promise<void>;
}

export function EditDepartmentModal({
  open,
  onClose,
  department,
  onSuccess,
  onSubmit,
}: EditDepartmentModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [responsible, setResponsible] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && department) {
      setCode(department.code ?? '');
      setName(department.name ?? '');
      setColor(department.color ?? '');
      setResponsible(department.responsibleUserId ?? '');
      setDateFrom(department.dateFrom ?? '');
      setDateTo(department.dateTo ?? '');
      setError(null);
    }
  }, [open, department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !name.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await onSubmit(department.id, {
        code: code.trim() || undefined,
        name: name.trim(),
        color: color.trim() || undefined,
        responsibleUserId: responsible.trim() || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (!department) return null;

  return (
    <Modal open={open} onClose={onClose} size="m">
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <h2 className="text-lg font-semibold text-gray-900">Editar departamento</h2>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100">
              {error}
            </div>
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
              <input type="color" value={color || '#6b7280'} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded border border-border-card cursor-pointer" />
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
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full border border-border-card rounded-lg px-3 py-2 min-h-[2.5rem]" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading || !name.trim()}>{loading ? 'Guardando…' : 'Guardar'}</Button>
          </div>
        </Stack>
      </form>
    </Modal>
  );
}
