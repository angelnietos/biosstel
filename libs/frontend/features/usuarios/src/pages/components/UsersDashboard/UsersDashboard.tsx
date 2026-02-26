/**
 * @biosstel/usuarios - UsersDashboard
 * Solo componentes de ui, ui-layout y shared.
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { Heading, Button, Skeleton, Card, Text, PlusIcon } from '@biosstel/ui';
import { Stack, PageContainer } from '@biosstel/ui-layout';
import { Link } from '@biosstel/platform';
import { AddDepartmentModal, createDepartment } from '@biosstel/shared';
import { useUsers } from '../../..';
import { UserList } from '../UserList';
import { UsersFilters, DEFAULT_FILTERS, type FilterValues, type FilterOptions } from '../UsersFilters/UsersFilters';
import type { User } from '../../../api/types';

/** Callout por fila: mensaje cuando el usuario no ha fichado (lastFichajeAt del API). */
function getStatusCallout(user: User): string | null {
  const last = user.lastFichajeAt;
  if (!last) return 'Aparece que no ha fichado.';
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = last.slice(0, 10);
  if (lastDate !== today) return 'No ha fichado hoy.';
  return null;
}

export const UsersDashboard = () => {
  const { data: users, fetchUsers, isLoading, error } = useUsers();
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filterOptions: FilterOptions = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    const formatRoleLabel = (role: string) =>
      role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    const departments = Array.from(
      new Set(list.map((u: User) => (u as any).departamento ?? (u as any).department ?? '').filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, 'es')).map((v) => ({ value: v, label: v }));
    const workCenters = Array.from(
      new Set(list.map((u: User) => (u as any).centroTrabajo ?? (u as any).workCenter ?? '').filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, 'es')).map((v) => ({ value: v, label: v }));
    const roles = Array.from(
      new Set(list.map((u: User) => u.role ?? '').filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, 'es')).map((v) => ({ value: v, label: formatRoleLabel(v) }));
    return { departments, workCenters, roles };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    if (!filters.search && !filters.department && !filters.workCenter && !filters.role && !filters.status) {
      return list;
    }
    const q = filters.search.toLowerCase().trim();
    return list.filter((u: User) => {
      if (q) {
        const name = [u.firstName, u.lastName, u.email].filter(Boolean).join(' ').toLowerCase();
        if (!name.includes(q)) return false;
      }
      const dept = (u as any).departamento ?? (u as any).department ?? '';
      if (filters.department && dept !== filters.department) return false;
      const center = (u as any).centroTrabajo ?? (u as any).workCenter ?? '';
      if (filters.workCenter && center !== filters.workCenter) return false;
      if (filters.role && (u.role ?? '') !== filters.role) return false;
      if (filters.status === 'active' && !u.isActive) return false;
      if (filters.status === 'inactive' && u.isActive) return false;
      return true;
    });
  }, [users, filters]);

  return (
    <PageContainer maxWidth="lg">
      <AddDepartmentModal
        open={showAddDepartment}
        onClose={() => setShowAddDepartment(false)}
        onSuccess={() => setShowAddDepartment(false)}
        onSubmit={async (data) => { await createDepartment(data); }}
      />
      <Stack gap={6}>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <Heading level={1} className="text-gray-900 font-bold">Usuario/as</Heading>
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              type="button"
              variant="secondary"
              className="inline-flex h-[43px] min-h-[43px] items-center justify-center gap-1.5 rounded-lg border border-border-card px-5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap shrink-0"
              onClick={() => setShowAddDepartment(true)}
            >
              <PlusIcon className="w-4 h-4 shrink-0" />
              Añadir Departamento +
            </Button>
            <Link
              href="/empresa/centros-trabajo"
              className="inline-flex h-[43px] min-h-[43px] items-center justify-center gap-1.5 rounded-lg border border-border-card px-5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap shrink-0"
            >
              <PlusIcon className="w-4 h-4 shrink-0" />
              Añadir Punto de venta +
            </Link>
            <Link
              href="/add-user"
              className="inline-flex h-[43px] min-h-[43px] items-center justify-center gap-1.5 rounded-lg bg-black px-5 text-sm font-semibold text-white hover:bg-gray-900 whitespace-nowrap shrink-0"
            >
              <PlusIcon className="w-4 h-4 shrink-0" />
              Añadir Usuario +
            </Link>
          </div>
        </div>

        <UsersFilters filters={filters} options={filterOptions} onFilterChange={setFilters} />

        {isLoading ? (
          <Stack gap={4}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="lg" className="w-full rounded-2xl" />
            ))}
          </Stack>
        ) : error ? (
          <Card className="p-10 text-center border border-border-card rounded-xl shadow-sm">
            <Text variant="body" className="font-medium text-red-600 mb-4">{error}</Text>
            <Button variant="secondary" onClick={() => fetchUsers()} className="border-border-card">
              Reintentar carga de usuarios
            </Button>
          </Card>
        ) : (
          <UserList
            users={filteredUsers}
            currentPage={1}
            totalUsers={filteredUsers.length}
            getStatusCallout={getStatusCallout}
          />
        )}
      </Stack>
    </PageContainer>
  );
};

