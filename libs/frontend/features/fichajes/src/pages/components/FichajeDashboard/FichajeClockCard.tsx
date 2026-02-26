'use client';

import { Card, Button, Text, ClockArc, Stack } from '@biosstel/ui';
import { Link } from '@biosstel/platform';
import { getClockArcVariant, getClockArcProgress } from './utils';

export interface FichajeClockCardProps {
  fichajeState: string;
  isClockLoading: boolean;
  userId: string | undefined;
  fichajeError: string | null;
  startTime: string | null | undefined;
  onClockIn: () => void;
  onClockOut: () => void;
  onPause: () => void;
  onResume: () => void;
  onClearError: () => void;
}

export function FichajeClockCard({
  fichajeState,
  isClockLoading,
  userId,
  fichajeError,
  startTime,
  onClockIn,
  onClockOut,
  onPause,
  onResume,
  onClearError,
}: FichajeClockCardProps) {
  const arcVariant = getClockArcVariant(fichajeState);
  const arcProgress = getClockArcProgress(fichajeState);

  return (
    <Card className="p-8 border border-border-card rounded-2xl shadow-sm">
      <Stack gap={4} align="center">
        {!userId && (
          <div className="w-full rounded-xl bg-amber-50 p-4 text-sm text-amber-800 border border-amber-100">
            Inicia sesión para registrar tu jornada.
          </div>
        )}
        {fichajeError && (
          <div className="w-full rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex justify-between items-center">
            <span>{fichajeError}</span>
            <button type="button" onClick={onClearError} className="font-bold underline">
              Cerrar
            </button>
          </div>
        )}
        {userId && (
          <>
            <div className="relative flex justify-center">
              <ClockArc variant={arcVariant} progress={arcProgress} />
              {fichajeState === 'working' && (
                <span className="absolute top-2 right-[-24px] px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">
                  Fichado
                </span>
              )}
              {fichajeState === 'paused' && (
                <span className="absolute top-2 right-[-24px] px-3 py-1 rounded-full bg-[#FFEBEE] text-[#C62828] text-xs font-semibold">
                  Pausado
                </span>
              )}
            </div>
            <Stack direction="row" gap={2} justify="center" className="flex-wrap">
              {fichajeState === 'idle' && (
                <Button type="button" variant="primary" onClick={onClockIn} disabled={isClockLoading}>
                  {isClockLoading ? 'Procesando...' : 'Fichar entrada'}
                </Button>
              )}
              {fichajeState === 'working' && (
                <>
                  <Button type="button" variant="secondary" onClick={onPause} disabled={isClockLoading}>
                    Pausar jornada
                  </Button>
                  <Button type="button" variant="primary" onClick={onClockOut} disabled={isClockLoading}>
                    Fichar salida
                  </Button>
                </>
              )}
              {fichajeState === 'paused' && (
                <>
                  <Button type="button" variant="secondary" onClick={onResume} disabled={isClockLoading}>
                    Retomar jornada
                  </Button>
                  <Button type="button" variant="primary" onClick={onClockOut} disabled={isClockLoading}>
                    Fichar salida
                  </Button>
                </>
              )}
            </Stack>
            {startTime && (
              <Text variant="muted" className="text-sm">
                Hora de entrada: <strong className="text-gray-900">{new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
              </Text>
            )}
            <Link href="/fichajes/control-jornada" className="text-sm font-medium text-gray-600 hover:text-black underline">
              Ver gestión de jornada y tareas →
            </Link>
          </>
        )}
      </Stack>
    </Card>
  );
}
