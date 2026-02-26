'use client';

import { Heading, Table, TableBody, TableCell, TableHead, TableRow, TableTh, Text, Skeleton } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { ScheduleItem } from './utils';
import { SKELETON_ROW_IDS, SKELETON_CELL_IDS } from './utils';

export interface HorariosTabProps {
  loading: boolean;
  schedules: ScheduleItem[];
}

export function HorariosTab({ loading, schedules }: HorariosTabProps) {
  if (loading) {
    return (
      <>
        <div className="px-5 pt-4 pb-2">
          <span className="text-xs font-medium text-muted bg-muted/50 px-2 py-1 rounded">Listado meramente consultivo</span>
          <Heading level={2} className="text-gray-900 font-semibold mt-2">
            Horarios laborales
          </Heading>
        </div>
        <Table>
          <TableHead>
            <TableRow className="bg-table-header">
              <TableTh>Nombre horario</TableTh>
              <TableTh>No. horas laborales</TableTh>
              <TableTh>Vacaciones</TableTh>
              <TableTh>Días libre disposición</TableTh>
              <TableTh>Horas/día L-V</TableTh>
              <TableTh>Horas/día Sábado</TableTh>
              <TableTh>Horas/semana</TableTh>
            </TableRow>
          </TableHead>
          <TableBody>
            {SKELETON_ROW_IDS.horarios.map((rowId) => (
              <TableRow key={rowId}>
                {SKELETON_CELL_IDS.horarios.map((cellId) => (
                  <TableCell key={cellId}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }

  if (schedules.length === 0) {
    return (
      <>
        <div className="px-5 pt-4 pb-2">
          <span className="text-xs font-medium text-muted bg-muted/50 px-2 py-1 rounded">Listado meramente consultivo</span>
          <Heading level={2} className="text-gray-900 font-semibold mt-2">
            Horarios laborales
          </Heading>
        </div>
        <Table>
          <TableHead>
            <TableRow className="bg-table-header">
              <TableTh>Nombre horario</TableTh>
              <TableTh>No. horas laborales</TableTh>
              <TableTh>Vacaciones</TableTh>
              <TableTh>Días libre disposición</TableTh>
              <TableTh>Horas/día L-V</TableTh>
              <TableTh>Horas/día Sábado</TableTh>
              <TableTh>Horas/semana</TableTh>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7}>
                <Stack gap={3} align="center" className="py-12">
                  <Text variant="muted">No hay horarios. Crea uno con el botón «Crear horario +».</Text>
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  }

  return (
    <>
      <div className="px-5 pt-4 pb-2">
        <span className="text-xs font-medium text-muted bg-muted/50 px-2 py-1 rounded">Listado meramente consultivo</span>
        <Heading level={2} className="text-gray-900 font-semibold mt-2">
          Horarios laborales
        </Heading>
      </div>
      <Table>
        <TableHead>
          <TableRow className="bg-table-header">
            <TableTh>Nombre horario</TableTh>
            <TableTh>No. horas laborales</TableTh>
            <TableTh>Vacaciones</TableTh>
            <TableTh>Días libre disposición</TableTh>
            <TableTh>Horas/día L-V</TableTh>
            <TableTh>Horas/día Sábado</TableTh>
            <TableTh>Horas/semana</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <Text variant="body">{s.name}</Text>
              </TableCell>
              <TableCell>
                <Text variant="muted">{s.hoursPerYear ?? '—'}</Text>
              </TableCell>
              <TableCell>
                <Text variant="muted">{s.vacationDays ?? '—'}</Text>
              </TableCell>
              <TableCell>
                <Text variant="muted">{s.freeDisposalDays ?? '—'}</Text>
              </TableCell>
              <TableCell>
                <Text variant="muted">{s.hoursPerDayWeekdays ?? '—'}</Text>
              </TableCell>
              <TableCell>
                <Text variant="muted">{s.hoursPerDaySaturday ?? '—'}</Text>
              </TableCell>
              <TableCell>
                <Text variant="muted">{s.hoursPerWeek ?? '—'}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
