import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableTh,
  TableCell,
} from './Table';

const meta: Meta<typeof Table> = {
  component: Table,
  title: 'UI/Table',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableTh>Nombre</TableTh>
          <TableTh>Estado</TableTh>
          <TableTh>Fecha</TableTh>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Usuario 1</TableCell>
          <TableCell>Activo</TableCell>
          <TableCell>18/02/2025</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Usuario 2</TableCell>
          <TableCell>Inactivo</TableCell>
          <TableCell>17/02/2025</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithManyRows: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableTh>ID</TableTh>
          <TableTh>Tarea</TableTh>
          <TableTh>Completada</TableTh>
        </TableRow>
      </TableHead>
      <TableBody>
        {[1, 2, 3, 4, 5].map((i) => (
          <TableRow key={i}>
            <TableCell>{i}</TableCell>
            <TableCell>Tarea ejemplo {i}</TableCell>
            <TableCell>{i % 2 === 0 ? 'Sí' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
