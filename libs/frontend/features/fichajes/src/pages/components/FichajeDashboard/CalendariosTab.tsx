'use client';

import { Button, Card, Table, TableBody, TableCell, TableHead, TableRow, TableTh, Text, Skeleton } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { SKELETON_ROW_IDS } from './utils';

export interface CalendariosTabProps {
  loading: boolean;
  calendars: { id: string; name: string }[];
  onRepeatYear: () => void;
}

export function CalendariosTab({ loading, calendars, onRepeatYear }: CalendariosTabProps) {
  if (loading) {
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-table-header">
            <TableTh>Nombre calendario</TableTh>
            <TableTh>Descripción</TableTh>
            <TableTh>{' '}</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {SKELETON_ROW_IDS.calendarios.map((rowId) => (
            <TableRow key={rowId}>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (calendars.length === 0) {
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-table-header">
            <TableTh>Nombre calendario</TableTh>
            <TableTh>Descripción</TableTh>
            <TableTh>{' '}</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3}>
              <Stack gap={3} align="center" className="py-12">
                <Text variant="muted">No hay calendarios. Crea uno con el botón superior.</Text>
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
          <TableTh>Nombre calendario</TableTh>
          <TableTh>Descripción</TableTh>
          <TableTh>{' '}</TableTh>
        </TableRow>
      </TableHead>
      <TableBody>
        {calendars.map((cal) => (
          <TableRow key={cal.id}>
            <TableCell>
              <Text variant="body">{cal.name}</Text>
            </TableCell>
            <TableCell>
              <Text variant="muted">—</Text>
            </TableCell>
            <TableCell>
              <Button variant="secondary" type="button" className="!py-1 !text-sm" onClick={onRepeatYear}>
                Repetir para siguiente año
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
