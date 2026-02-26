'use client';

import { StatusBadge } from '@biosstel/ui';

export function StatusBadgeByStatus({ status }: { status: string }) {
  switch (status) {
    case 'working':
      return <StatusBadge label="Fichado" status="success" />;
    case 'paused':
      return <StatusBadge label="Pausado" status="warning" />;
    case 'finished':
      return <StatusBadge label="Finalizado" status="muted" />;
    default:
      return <StatusBadge label="Sin fichar" status="error" />;
  }
}
