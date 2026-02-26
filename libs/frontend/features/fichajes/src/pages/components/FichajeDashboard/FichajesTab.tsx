'use client';

import { Link } from '@biosstel/platform';
import { Chip, ProgressBar, Table, TableBody, TableCell, TableHead, TableRow, TableTh, Text, Skeleton } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import type { DashboardRow } from './utils';
import {
  formatMinutes,
  formatTime,
  pct,
  getRoleVariant,
  getProgressVariant,
  HOURS_OBJETIVO,
  SKELETON_ROW_IDS,
  SKELETON_CELL_IDS,
} from './utils';
import { StatusBadgeByStatus } from './StatusBadgeByStatus';

export interface FichajesTabProps {
  isLoading: boolean;
  rows: DashboardRow[];
  filteredRows: DashboardRow[];
}

export function FichajesTab({ isLoading, rows, filteredRows }: FichajesTabProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-table-header">
            <TableTh>Usuario</TableTh>
            <TableTh>Horas fichadas</TableTh>
            <TableTh>Horas acumuladas</TableTh>
            <TableTh>Departamento</TableTh>
            <TableTh>Última localización</TableTh>
            <TableTh>% Total horas por semana</TableTh>
            <TableTh>% Horas mes</TableTh>
            <TableTh>% Año</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {SKELETON_ROW_IDS.fichajes.map((rowId) => (
            <TableRow key={rowId}>
              {SKELETON_CELL_IDS.fichajes.map((cellId) => (
                <TableCell key={cellId}>
                  <Skeleton />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (filteredRows.length === 0) {
    const emptyMessage = rows.length === 0 ? 'No hay fichajes para la fecha seleccionada.' : 'Ningún resultado con los filtros aplicados.';
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-table-header">
            <TableTh>Usuario</TableTh>
            <TableTh>Horas fichadas</TableTh>
            <TableTh>Horas acumuladas</TableTh>
            <TableTh>Departamento</TableTh>
            <TableTh>Última localización</TableTh>
            <TableTh>% Total horas por semana</TableTh>
            <TableTh>% Horas mes</TableTh>
            <TableTh>% Año</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8}>
              <Stack gap={3} align="center" className="py-12">
                <Text variant="muted">{emptyMessage}</Text>
                <Link href="/fichajes/control-jornada" className="text-sm font-medium text-gray-600 hover:text-black underline">
                  Ir a control de jornada →
                </Link>
              </Stack>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow className="bg-table-header">
          <TableTh>Usuario</TableTh>
          <TableTh>Horas fichadas</TableTh>
          <TableTh>Horas acumuladas</TableTh>
          <TableTh>Departamento</TableTh>
          <TableTh>Última localización</TableTh>
          <TableTh>% Total horas por semana</TableTh>
          <TableTh>% Horas mes</TableTh>
          <TableTh>% Año</TableTh>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredRows.map((row) => {
          const horasMes = Math.round(row.minutosHoy * 4.3);
          const horasAno = Math.round(row.minutosHoy * 52);
          const pctSem = pct(row.minutosHoy);
          const pctMes = pct(horasMes, HOURS_OBJETIVO * 4);
          const pctAno = pct(horasAno, HOURS_OBJETIVO * 52);
          const locationText = row.location
            ? `${row.location.lat.toFixed(4)}, ${row.location.lng.toFixed(4)} ${formatTime(row.startTime)}`
            : '-';
          return (
            <TableRow key={row.userId}>
              <TableCell>
                <Stack direction="row" gap={2} align="center">
                  <StatusBadgeByStatus status={row.status} />
                  <Text variant="body" as="span">
                    {row.firstName} {row.lastName}
                  </Text>
                </Stack>
              </TableCell>
              <TableCell>
                <Text variant="small">{formatMinutes(row.minutosHoy)}</Text>
              </TableCell>
              <TableCell>
                <Text variant="muted">Xhrs por semana</Text>
              </TableCell>
              <TableCell>
                <Chip variant={getRoleVariant(row.role)}>{row.role?.charAt(0) + row.role?.slice(1).toLowerCase()}</Chip>
              </TableCell>
              <TableCell>
                <Text variant="small">{locationText}</Text>
              </TableCell>
              <TableCell>
                <ProgressBar value={pctSem} max={110} showLabel variant={getProgressVariant(pctSem)} />
              </TableCell>
              <TableCell>
                <ProgressBar value={pctMes} max={110} showLabel variant={getProgressVariant(pctMes)} />
              </TableCell>
              <TableCell>
                <ProgressBar value={pctAno} max={110} showLabel variant={getProgressVariant(pctAno)} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
