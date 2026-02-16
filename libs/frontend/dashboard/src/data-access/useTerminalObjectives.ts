/**
 * @biosstel/dashboard - useTerminalObjectives hook
 */

'use client';

import { useEffect, useState } from 'react';
import type { TerminalObjectivesResponse } from '@biosstel/shared-types';
import { getTerminalObjectives } from './dashboardApi';

export function useTerminalObjectives() {
  const [data, setData] = useState<TerminalObjectivesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getTerminalObjectives()
      .then((d) => {
        if (cancelled) return;
        setData(d);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message ?? 'Error cargando objetivos terminales');
        setData(null);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}

