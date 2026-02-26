/**
 * @biosstel/objetivos - useTerminalObjectives hook (despacha fetchTerminalObjectives y lee estado desde Redux)
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerminalObjectives, fetchTerminalObjectivesByPeriod, type DashboardState } from '../store/dashboardSlice';

export type TerminalObjectiveTab = 'contratos' | 'puntos';

export function useTerminalObjectives(type: TerminalObjectiveTab = 'contratos') {
  const dispatch = useDispatch();
  const { terminalData, isLoading, error } = useSelector(
    (state: { dashboard: DashboardState }) => state.dashboard
  );

  const refetch = useCallback(() => {
    return (dispatch as (thunk: ReturnType<typeof fetchTerminalObjectives>) => Promise<unknown>)(fetchTerminalObjectives({ type: [type] }));
  }, [dispatch, type]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data: terminalData, isLoading, error, refetch };
}

/** Datos de objetivos terminales por periodo (histórico). Despacha thunk y lee estado desde Redux. */
export function useTerminalObjectivesByPeriod(
  type: TerminalObjectiveTab,
  period: string | null
) {
  const dispatch = useDispatch();
  const { terminalDataByPeriod, terminalByPeriodLoading } = useSelector(
    (state: { dashboard: DashboardState }) => state.dashboard
  );

  const key = period ? `${type}-${period}` : '';

  useEffect(() => {
    if (!period) return;
    (dispatch as (thunk: ReturnType<typeof fetchTerminalObjectivesByPeriod>) => void)(fetchTerminalObjectivesByPeriod({ type, period }));
  }, [dispatch, type, period]);

  const data = terminalDataByPeriod.key === key ? terminalDataByPeriod.data : null;
  return { data, isLoading: terminalByPeriodLoading };
}
