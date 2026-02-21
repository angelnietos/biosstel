/**
 * @biosstel/objetivos - useDashboardHome hook (despacha fetchDashboardHome y lee estado desde Redux)
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardHome, type DashboardState } from '../store/dashboardSlice';

export function useDashboardHome(filters: Record<string, string[]>, enabled: boolean) {
  const dispatch = useDispatch();
  const { homeData, isLoading, error } = useSelector(
    (state: { dashboard: DashboardState }) => state.dashboard
  );

  const key = useMemo(() => JSON.stringify(filters ?? {}), [filters]);

  useEffect(() => {
    if (!enabled) return;
    (dispatch as (thunk: ReturnType<typeof fetchDashboardHome>) => void)(fetchDashboardHome(filters));
  }, [enabled, key, dispatch, filters]);

  return { data: homeData, isLoading, error };
}
