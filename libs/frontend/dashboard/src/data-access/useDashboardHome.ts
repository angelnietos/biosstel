/**
 * @biosstel/dashboard - useDashboardHome hook
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DashboardHomeResponse } from '@biosstel/shared-types';
import { getDashboardHome } from './dashboardApi';

export function useDashboardHome(filters: Record<string, string[]>, enabled: boolean) {
  const [data, setData] = useState<DashboardHomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = useMemo(() => JSON.stringify(filters ?? {}), [filters]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getDashboardHome(filters)
      .then((d) => {
        if (cancelled) return;
        setData(d);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message ?? 'Error cargando dashboard');
        setData(null);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key]);

  return { data, isLoading, error };
}

