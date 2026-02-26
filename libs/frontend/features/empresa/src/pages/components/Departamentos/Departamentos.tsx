/**
 * @biosstel/empresa - Departamentos
 * Creación y asignación de colores a departamentos. Layout Figma. Datos desde API.
 */

'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text, Card } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { logUserAction, logFormSubmit } from '@biosstel/platform';
import { EmpresaPageLayout } from '../../layouts';
import { fetchEmpresa, type EmpresaState } from '../../../data-access';
import { AddDepartmentModal, createDepartment, updateDepartment } from '@biosstel/shared';
import type { Department } from '@biosstel/shared-types';
import { EditDepartmentModal } from './EditDepartmentModal';

export const Departamentos = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { empresa: EmpresaState }) => state.empresa);
  const departamentos = data?.departamentos ?? [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    (dispatch as (thunk: unknown) => void)(fetchEmpresa());
  }, [dispatch]);

  const reload = () => (dispatch as (thunk: unknown) => void)(fetchEmpresa());
  const isEmpty = !loading && !error && departamentos.length === 0;

  return (
    <EmpresaPageLayout title="Departamentos">
      <AddDepartmentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={reload}
        onSubmit={async (data) => {
          logFormSubmit('empresa_departamento_add', undefined, { name: data.name });
          await createDepartment(data);
        }}
      />
      <Stack gap={6}>
        <div className="flex justify-end">
          <Button type="button" variant="primary" onClick={() => { logUserAction('empresa_departamento_open_add'); setShowAddModal(true); }} className="h-[43px] font-semibold">Añadir departamento</Button>
        </div>
        <Card className="p-0 overflow-hidden shadow-sm border border-border-card rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Color</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted">Cargando...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-red-600">{error}</td>
                </tr>
              )}
              {!loading && !error && departamentos.length > 0 && departamentos.map((d) => (
                <tr key={d.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{d.name}</td>
                  <td className="px-4 py-3">
                    {d.color && (
                      <span
                        className="inline-block w-6 h-6 rounded border border-border-card"
                        style={{ backgroundColor: d.color }}
                        title={d.color}
                      />
                    )}
                    {!d.color && <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="!py-1 !text-sm"
                      onClick={() => {
                        logUserAction('empresa_departamento_open_edit');
                        setEditingDepartment(d);
                      }}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
              {isEmpty && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4 text-muted">No hay departamentos. Añade uno para asignar colores.</Text>
                    <Button type="button" variant="secondary" onClick={() => setShowAddModal(true)}>Añadir departamento</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </Stack>
      <EditDepartmentModal
        open={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        department={editingDepartment}
        onSuccess={reload}
        onSubmit={async (id, data) => {
          logFormSubmit('empresa_departamento_edit', undefined, { id, name: data.name });
          await updateDepartment(id, data);
        }}
      />
    </EmpresaPageLayout>
  );
};

export default Departamentos;
