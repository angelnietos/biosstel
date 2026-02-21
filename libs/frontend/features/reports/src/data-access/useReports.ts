import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportsSummary, type ReportsState } from './store';

export function useReports() {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { reports: ReportsState }) => state.reports);

  const fetchSummary = useCallback(() => {
    (dispatch as (thunk: ReturnType<typeof fetchReportsSummary>) => void)(fetchReportsSummary());
  }, [dispatch]);

  return { data, loading, error, fetchSummary };
}
