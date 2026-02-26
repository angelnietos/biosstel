/**
 * Modal para revisar un contrato/tarea (aprobar o rechazar).
 */
'use client';

import { Modal, Button, Text } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { RevisionBackoffice } from '@biosstel/shared-types';

export interface RevisarModalProps {
  open: boolean;
  onClose: () => void;
  item: RevisionBackoffice | null;
  onAprobar: (id: string) => void;
  onRechazar: (id: string) => void;
}

export function RevisarModal({ open, onClose, item, onAprobar, onRechazar }: RevisarModalProps) {
  if (!item) return null;

  const handleAprobar = () => {
    onAprobar(item.id);
    onClose();
  };

  const handleRechazar = () => {
    onRechazar(item.id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="m">
      <Stack gap={4}>
        <h2 className="text-lg font-semibold text-gray-900">Revisar contrato / tarea</h2>
        <div className="space-y-2">
          <p><strong>Contrato / Tarea:</strong> {item.contratoTarea}</p>
          <p><strong>Fecha:</strong> {item.fecha}</p>
          <p><strong>Estado actual:</strong> {item.estado}</p>
        </div>
        <Text variant="small" className="text-muted">
          Confirme la acción para este elemento.
        </Text>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="button" variant="secondary" onClick={handleRechazar} className="!bg-red-50 !text-red-700 hover:!bg-red-100">
            Rechazar
          </Button>
          <Button type="button" variant="primary" onClick={handleAprobar}>
            Aprobar
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
