/**
 * @biosstel/objetivos - Objetivos Familia
 * Misma estructura que Niveles pero solo objetivos de tipo familia y título "Objetivos Familia".
 */

'use client';

import { useState, useMemo } from 'react';
import { Card, Heading, Text, Skeleton, Alert } from '@biosstel/ui';
import { Stack, Grid } from '@biosstel/ui-layout';
import { FilterBar, type FilterBarValues } from '../FilterBar';
import { ObjectiveCard } from '../ObjectiveCard';
import { useDashboardHome } from '../../..';
import { DASHBOARD_FILTER_OPTIONS, getObjectiveTypeFromTitle, type ThemeColor } from '../../../data-access/models';

export const ObjetivosFamiliaPage = () => {
  const [filterValues, setFilterValues] = useState<FilterBarValues>({
    marca: 'all',
    departamentos: 'all',
    centrosTrabajo: 'all',
    usuarios: 'all',
    familia: 'all',
    subfamilia: 'all',
    productos: 'all',
    estado: 'all',
  });

  const apiFilters = useMemo(() => {
    const record: Record<string, string[]> = {};
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        if (value instanceof Date) record[key] = [value.toISOString()];
        else record[key] = [String(value)];
      }
    });
    return record;
  }, [filterValues]);

  const { data, isLoading, error } = useDashboardHome(apiFilters, true);
  const allObjectives = data?.objectives ?? [];
  const objectives = useMemo(() => allObjectives.filter((o) => getObjectiveTypeFromTitle(o.title) === 'family'), [allObjectives]);
  const hasObjectives = objectives.length > 0;

  return (
    <Stack gap={6}>
      <Heading level={1} className="text-gray-900 font-bold">Objetivos Familia</Heading>
      <FilterBar
        values={filterValues}
        onChange={setFilterValues}
        options={DASHBOARD_FILTER_OPTIONS}
      />

      {isLoading ? (
        <Grid cols={2} gap={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Stack gap={4}>
                <Skeleton height="sm" className="w-40" />
                <Skeleton height="lg" className="w-64" />
                <Skeleton height="sm" className="w-full" />
              </Stack>
            </Card>
          ))}
        </Grid>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : hasObjectives ? (
        <Grid cols={2} gap={4}>
          {objectives.map((obj, index) => {
            const accentList: ThemeColor[] = ['maroon', 'teal', 'blue', 'purple', 'magenta'];
            const accent = (obj.accent && accentList.includes(obj.accent as ThemeColor)
              ? obj.accent
              : accentList[index % accentList.length]) as ThemeColor;
            return (
              <ObjectiveCard
                key={obj.id}
                title={obj.title}
                achieved={obj.achieved}
                objective={obj.objective}
                accent={accent}
                href={obj.href ?? `/home/objectives/${obj.id}`}
              />
            );
          })}
        </Grid>
      ) : (
        <Card className="px-6 py-5 border border-border-card rounded-xl shadow-sm">
          <Text variant="muted">No hay objetivos de familia con los filtros aplicados. Pruebe otros filtros o vea todos en Niveles de objetivos.</Text>
        </Card>
      )}
    </Stack>
  );
};

export default ObjetivosFamiliaPage;
