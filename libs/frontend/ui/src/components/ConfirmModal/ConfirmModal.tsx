/**
 * @biosstel/ui - ConfirmModal
 * Modal with title, description, confirm and cancel buttons (Figma).
 */

import { ReactNode } from 'react';
import { Modal } from '../Modal';
import { Button } from '../buttons/Button';

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon?: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel,
}: ConfirmModalProps) => (
  <Modal open={open} onClose={onClose} size="s">
    {icon != null && (
      <div className="flex items-center justify-start" aria-hidden>
        {icon}
      </div>
    )}
    <div className="flex flex-col gap-2">
      <h2 className="text-h2 font-semibold text-black">{title}</h2>
      <p className="text-sm font-normal leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
    <div className="mt-1 flex flex-col gap-1">
      <Button variant="primaryLg" onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button variant="cancelLg" onClick={onClose}>
        {cancelLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmModal;
