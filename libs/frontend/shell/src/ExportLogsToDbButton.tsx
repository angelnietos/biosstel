'use client';

import { useState, useEffect } from 'react';
import { Button, useToast } from '@biosstel/ui';
import { getFlowLog, API_BASE_URL, getAuthHeaders } from '@biosstel/platform';

function isDev(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
}

/**
 * Botón flotante (solo en dev) que exporta el log de flujo del frontend a la BD.
 * POST /api/v1/dev-logs con { entries: getFlowLog() }.
 * Solo se renderiza tras montar en cliente para evitar hydration mismatch.
 */
export function ExportLogsToDbButton() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => setMounted(true), []);

  if (!mounted || !isDev()) return null;

  const handleExport = async () => {
    const entries = getFlowLog();
    if (entries.length === 0) {
      addToast('No hay entradas en el log. Navega o realiza acciones y vuelve a intentar.', 'info');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/dev-logs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || `Error ${res.status}`);
      }
      const data = (await res.json()) as { id?: string };
      addToast(`Log exportado a la BD correctamente. (id: ${data?.id ?? '—'})`, 'success');
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al exportar el log.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999]"
      title="Exportar log de flujo a la base de datos (solo dev)"
    >
      <Button
        type="button"
        variant="secondary"
        onClick={handleExport}
        disabled={loading}
        className="!h-9 !px-3 !text-xs font-medium shadow-md border border-gray-300"
      >
        {loading ? 'Exportando…' : 'Exportar logs a BD'}
      </Button>
    </div>
  );
}
