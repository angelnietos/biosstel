/**
 * @biosstel/objetivos - Dashboard Home Page
 * Solo componentes de ui, ui-layout y shared.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Heading, Text, Skeleton, Alert, Button, ClockArc } from '@biosstel/ui';
import { Grid, Stack } from '@biosstel/ui-layout';
import { Link } from '@biosstel/platform';
import { useCanFichar, useCanManageFichajes } from '@biosstel/shared';
import { FilterBar, type FilterBarValues } from '../FilterBar';
import { FamilyObjectiveCard } from '../FamilyObjectiveCard';
import { AlertsTable } from '@biosstel/shared';
import { useDashboardHome } from '../../..';
import { DASHBOARD_FILTER_OPTIONS, type ThemeColor } from '../../../data-access/models';

export const DashboardHomePage = () => {
  const authUser = useSelector((state: any) => state.auth?.user);
  const currentFichaje = useSelector((state: any) => state.fichajes?.currentFichaje);
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

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filterValues).some(([key, value]) => {
      if (key === 'marca' || key === 'departamentos' || key === 'centrosTrabajo' || key === 'usuarios' || key === 'familia' || key === 'subfamilia' || key === 'productos' || key === 'estado') {
        return value !== 'all' && value !== '';
      }
      return !!value;
    });
  }, [filterValues]);

  // Map our FilterBarValues to what useDashboardHome expects (Record<string, string[]>)
  const apiFilters = useMemo(() => {
    const record: Record<string, string[]> = {};
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          record[key] = [value.toISOString()];
        } else if (value !== 'all') {
          record[key] = [String(value)];
        }
      }
    });
    return record;
  }, [filterValues]);

  const { data, isLoading, error } = useDashboardHome(apiFilters, true);
  const objectives = data?.objectives ?? [];
  const alerts = data?.alerts ?? [];
  const showFicharEntrada = useCanFichar();
  const showManageFichajes = useCanManageFichajes();
  const fueraHorario = (currentFichaje as { fueraHorario?: boolean } | undefined)?.fueraHorario === true;

  return (
    <Stack gap={6}>
      <header className="flex flex-col gap-2">
        <Heading level={1} className="text-gray-900 font-bold">Inicio</Heading>
      </header>

      <FilterBar 
        values={filterValues} 
        onChange={setFilterValues} 
        options={DASHBOARD_FILTER_OPTIONS}
      />

      {/* Figma Base-10/18 + Base-15: Fichar entrada; reloj rojo "Ficho mal fuera de horario" cuando fueraHorario */}
      {showFicharEntrada && (
        <Card className="p-6 border border-border-card rounded-xl shadow-sm">
          <Stack gap={4} align="center">
            <div className="flex flex-col items-center gap-2">
              <ClockArc
                variant={fueraHorario ? 'red' : currentFichaje ? 'green' : 'gray'}
                progress={currentFichaje ? 50 : 0}
              />
              {fueraHorario && (
                <Text variant="small" className="font-semibold text-red-600">
                  Ficho mal fuera de horario
                </Text>
              )}
            </div>
            {!currentFichaje && (
              <Link href="/fichajes/control-jornada" className="w-full sm:w-auto">
                <Button type="button" variant="primary" className="w-full sm:min-w-[200px]">
                  Fichar entrada
                </Button>
              </Link>
            )}
            {currentFichaje && !fueraHorario && (
              <Link href="/fichajes/control-jornada" className="text-sm text-muted underline hover:text-gray-900">
                Ver gestión de jornada y tareas →
              </Link>
            )}
            {currentFichaje && fueraHorario && (
              <Link href="/fichajes/control-jornada" className="text-sm font-medium text-red-600 underline">
                Pausar jornada / Fichar salida →
              </Link>
            )}
            {(showFicharEntrada || showManageFichajes) && (
              <Link href="/fichajes" className="text-sm font-medium text-gray-600 hover:text-black underline">
                Ver listado de fichajes →
              </Link>
            )}
          </Stack>
        </Card>
      )}

      {!showFicharEntrada && showManageFichajes && (
        <Card className="p-6 border border-border-card rounded-xl shadow-sm">
          <Stack gap={2} align="center">
            <Link href="/fichajes" className="text-sm font-medium text-gray-600 hover:text-black underline">
              Ver listado de fichajes →
            </Link>
          </Stack>
        </Card>
      )}

      <section>
        {isLoading ? (
          <Grid cols={3} gap={4}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-5 overflow-hidden">
                <Stack gap={4}>
                  <Skeleton height="sm" className="w-40" />
                  <Skeleton height="md" className="w-full" />
                </Stack>
              </Card>
            ))}
          </Grid>
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : hasActiveFilters ? (
          <Grid cols={3} gap={4}>
            {objectives.map((obj, index) => {
              const accents: ThemeColor[] = ['maroon', 'teal', 'blue', 'purple', 'magenta'];
              const accent = (obj.accent && accents.includes(obj.accent as ThemeColor)
                ? obj.accent
                : accents[index % accents.length]) as ThemeColor;

              return (
                <FamilyObjectiveCard
                  key={obj.id}
                  name={obj.title}
                  achieved={obj.achieved}
                  target={obj.objective}
                  color={accent}
                  href={obj.href ?? '#'}
                  isPending={obj.objective === 0}
                />
              );
            })}
          </Grid>
        ) : (
          <Card className="flex items-center justify-center py-16 px-6 border border-dashed border-border-card bg-gray-50/50 rounded-2xl">
            <Stack gap={2} align="center">
              <Text variant="body" className="text-muted font-medium text-center">
                Primero se ha de filtrar ↑ para mostrar los datos posteriormente ↓
              </Text>
              <Text variant="small" className="text-gray-400 text-center">
                Por favor realiza un filtro previo para que se muestren los datos de objetivos
              </Text>
            </Stack>
          </Card>
        )}
      </section>

      <section>
        <AlertsTable alerts={alerts} isLoading={isLoading} />
      </section>
    </Stack>
  );
};

export default DashboardHomePage;

