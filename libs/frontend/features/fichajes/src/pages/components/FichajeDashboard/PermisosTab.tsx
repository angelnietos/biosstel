'use client';

import { Chip, Table, TableBody, TableCell, TableHead, TableRow, TableTh, Text, Skeleton } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { SKELETON_ROW_IDS } from './utils';

export interface PermisosTabProps {
  loading: boolean;
  permissionTypes: { id: string; name: string; isPaid: boolean }[];
}

function getPermissionTypeLabel(isPaid: boolean): string {
  return isPaid ? 'Retribuido' : 'No retribuido';
}

function getPermissionChipVariant(isPaid: boolean): 'info' | 'default' {
  return isPaid ? 'info' : 'default';
}

export function PermisosTab({ loading, permissionTypes }: PermisosTabProps) {
  if (loading) {
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-table-header">
            <TableTh>Nombre permiso</TableTh>
            <TableTh>Tipo</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          {SKELETON_ROW_IDS.permisos.map((rowId) => (
            <TableRow key={rowId}>
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

  if (permissionTypes.length === 0) {
    return (
      <Table>
        <TableHead>
          <TableRow className="bg-table-header">
            <TableTh>Nombre permiso</TableTh>
            <TableTh>Tipo</TableTh>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
              <Stack gap={3} align="center" className="py-12">
                <Text variant="muted">No hay tipos de permiso. Crea uno con el botón «Crear Permiso +».</Text>
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
          <TableTh>Nombre permiso</TableTh>
          <TableTh>Tipo</TableTh>
        </TableRow>
      </TableHead>
      <TableBody>
        {permissionTypes.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <Text variant="body">{p.name}</Text>
            </TableCell>
            <TableCell>
              <Chip variant={getPermissionChipVariant(p.isPaid)}>{getPermissionTypeLabel(p.isPaid)}</Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
