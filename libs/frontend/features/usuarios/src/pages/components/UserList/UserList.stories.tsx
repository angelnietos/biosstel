import type { Meta, StoryObj } from '@storybook/react';
import { UserList } from './index';
import type { User } from '../../../api/types';

const meta: Meta<typeof UserList> = {
  component: UserList,
  title: 'Features/Usuarios/UserList',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    onPageChange: { action: 'pageChange' },
  },
};

export default meta;

type Story = StoryObj<typeof UserList>;

const sampleUsers: (User & { departamento?: string; centroTrabajo?: string })[] = [
  { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@biosstel.com', role: 'ADMIN', isActive: true, departamento: 'Comercial', centroTrabajo: 'Las Arenas' },
  { id: '2', firstName: 'Coordinador', lastName: 'Test', email: 'coordinador@biosstel.com', role: 'COORDINADOR', isActive: true, departamento: 'Comercial', centroTrabajo: 'Barakaldo' },
  { id: '3', firstName: 'Telemarketing', lastName: 'User', email: 'telemarketing@biosstel.com', role: 'TELEMARKETING', isActive: true, departamento: 'Telemarketing', centroTrabajo: 'Centro Telemarketing' },
  { id: '4', firstName: 'Tienda', lastName: 'User', email: 'tienda@biosstel.com', role: 'TIENDA', isActive: true, departamento: 'Tienda', centroTrabajo: 'Tienda Centro' },
  { id: '5', firstName: 'Comercial', lastName: 'User', email: 'comercial@biosstel.com', role: 'COMERCIAL', isActive: true, departamento: 'Comercial', centroTrabajo: 'Barakaldo' },
  { id: '6', firstName: 'Backoffice', lastName: 'User', email: 'backoffice@biosstel.com', role: 'BACKOFFICE', isActive: false, departamento: 'Comercial', centroTrabajo: 'Las Arenas' },
];

/** Figma Base: tabla Usuario, Departamento, Centro de trabajo, Rol (badges), Status (reloj), Acciones. */
export const Default: Story = {
  args: {
    users: sampleUsers,
    currentPage: 1,
    totalUsers: 6,
    onPageChange: (page) => console.log('page', page),
    getStatusCallout: (user) => (user.isActive ? null : 'No ha fichado hoy.'),
  },
};

/** Con callout de estado por fila (Figma: "Aparece que no ha fichado..."). */
export const WithStatusCallouts: Story = {
  args: {
    users: sampleUsers,
    currentPage: 1,
    totalUsers: 6,
    getStatusCallout: () => 'No ha fichado hoy.',
  },
};

/** Sin departamento/centro (valores vacíos). */
export const WithoutDepartmentAndCenter: Story = {
  args: {
    users: sampleUsers.map((u) => ({ ...u, departamento: undefined, centroTrabajo: undefined })),
    currentPage: 1,
    totalUsers: 3,
  },
};

export const Empty: Story = {
  args: {
    users: [],
    currentPage: 1,
    totalUsers: 0,
  },
};
