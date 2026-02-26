/**
 * @biosstel/empresa - CentrosTrabajo
 * Gestión de ubicaciones físicas. Layout Figma. Datos desde API.
 */

'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text, Input, Modal } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { logUserAction } from '@biosstel/platform';
import { EmpresaPageLayout } from '../../layouts';
import { fetchEmpresa, createWorkCenterThunk, updateWorkCenterThunk, type EmpresaState } from '../../../data-access';

export const CentrosTrabajo = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { empresa: EmpresaState }) => state.empresa);
  const centros = data?.centros ?? [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingCenter, setEditingCenter] = useState<{ id: string; name: string; address?: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    (dispatch as (thunk: ReturnType<typeof fetchEmpresa>) => void)(fetchEmpresa());
  }, [dispatch]);

  const openAddModal = () => {
    setNewName('');
    setNewAddress('');
    setSubmitError(null);
    setShowAddModal(true);
  };

  const handleAddCenter = async () => {
    if (!newName.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await (dispatch as (thunk: unknown) => Promise<{ type: string; error?: { message?: string } }>)(createWorkCenterThunk({ name: newName.trim(), address: newAddress.trim() || undefined }));
    setSubmitting(false);
    if (createWorkCenterThunk.rejected.match(result)) {
      setSubmitError(result.error?.message ?? 'Error al crear el centro');
    } else {
      setShowAddModal(false);
    }
  };

  const openEditModal = (c: { id: string; name: string; address?: string }) => {
    setEditingCenter(c);
    setEditName(c.name);
    setEditAddress(c.address ?? '');
    setEditError(null);
  };

  const handleUpdateCenter = async () => {
    if (!editingCenter || !editName.trim()) return;
    logUserAction('empresa_centro_update', undefined, { id: editingCenter.id, name: editName.trim() });
    setEditSubmitting(true);
    setEditError(null);
    const result = await (dispatch as (thunk: unknown) => Promise<{ type: string; error?: { message?: string } }>)(updateWorkCenterThunk({
      id: editingCenter.id,
      data: { name: editName.trim(), address: editAddress.trim() || undefined },
    }));
    setEditSubmitting(false);
    if (updateWorkCenterThunk.rejected.match(result)) {
      setEditError(result.error?.message ?? 'Error al guardar');
    } else {
      setEditingCenter(null);
    }
  };

  const isEmpty = !loading && !error && centros.length === 0;

  return (
    <EmpresaPageLayout title="Centros de trabajo">
      <Stack gap={6}>
        <div className="flex justify-end">
          <Button type="button" variant="primary" onClick={openAddModal}>Añadir centro</Button>
        </div>

        <Modal open={showAddModal} onClose={() => setShowAddModal(false)} size="m">
          <Stack gap={4}>
            <Text as="h2" className="text-lg font-semibold text-gray-900">Añadir centro de trabajo</Text>
            {submitError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</div>}
            <Input
              label="Nombre"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Sede central"
            />
            <Input
              label="Dirección"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Ej. Av. Principal 100"
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancelar</Button>
              <Button type="button" variant="primary" disabled={!newName.trim() || submitting} onClick={handleAddCenter}>
                {submitting ? 'Guardando…' : 'Añadir'}
              </Button>
            </div>
          </Stack>
        </Modal>

        <Modal open={editingCenter != null} onClose={() => setEditingCenter(null)} size="m">
          <Stack gap={4}>
            <Text as="h2" className="text-lg font-semibold text-gray-900">Editar centro de trabajo</Text>
            {editError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{editError}</div>}
            <Input
              label="Nombre"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Ej. Sede central"
            />
            <Input
              label="Dirección"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="Ej. Av. Principal 100"
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setEditingCenter(null)}>Cancelar</Button>
              <Button type="button" variant="primary" disabled={!editName.trim() || editSubmitting} onClick={handleUpdateCenter}>
                {editSubmitting ? 'Guardando…' : 'Guardar'}
              </Button>
            </div>
          </Stack>
        </Modal>

        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Dirección</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">Cargando...</td></tr>
              )}
              {error && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-red-600">{error}</td></tr>
              )}
              {!loading && !error && centros.length > 0 && centros.map((c) => (
                <tr key={c.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.address ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Button type="button" variant="secondary" className="!py-1 !text-sm" onClick={() => openEditModal(c)}>Editar</Button>
                  </td>
                </tr>
              ))}
              {isEmpty && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4 text-muted">No hay centros de trabajo.</Text>
                    <Button type="button" variant="secondary" onClick={openAddModal}>Añadir centro</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Stack>
    </EmpresaPageLayout>
  );
};

export default CentrosTrabajo;
