'use client';

import { Button, Heading, Input, Modal, Stack, Text } from '@biosstel/ui';

export interface FichajePermissionModalProps {
  open: boolean;
  permissionName: string;
  permissionPaid: boolean;
  submitting: boolean;
  onClose: () => void;
  onPermissionNameChange: (value: string) => void;
  onPermissionPaidChange: (value: boolean) => void;
  onSubmit: () => Promise<void>;
}

export function FichajePermissionModal({
  open,
  permissionName,
  permissionPaid,
  submitting,
  onClose,
  onPermissionNameChange,
  onPermissionPaidChange,
  onSubmit,
}: FichajePermissionModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="s" allowClose>
      <Stack gap={4}>
        <Heading level={2} className="text-lg font-semibold text-gray-900">
          Nuevo Permiso
        </Heading>
        <Input label="Nombre del permiso" value={permissionName} onChange={(e) => onPermissionNameChange(e.target.value)} placeholder="Ej. Vacaciones" />
        <div>
          <Text variant="small" className="block mb-2 text-muted" id="permission-type-label">
            Tipo
          </Text>
          <Stack direction="row" gap={2}>
            <Button variant={permissionPaid ? 'primary' : 'secondary'} type="button" onClick={() => onPermissionPaidChange(true)} aria-pressed={permissionPaid}>
              Retribuido +
            </Button>
            <Button variant={permissionPaid ? 'secondary' : 'primary'} type="button" onClick={() => onPermissionPaidChange(false)} aria-pressed={!permissionPaid}>
              No retribuido +
            </Button>
          </Stack>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="button" disabled={!permissionName.trim() || submitting} onClick={onSubmit}>
            {submitting ? 'Creando…' : 'Crear'}
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
