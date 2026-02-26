'use client';

import { useEffect, useState } from 'react';
import type { InventoryItem } from '@biosstel/shared-types';
import { logUserAction } from '@biosstel/platform';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Button, Text, Card, Modal, Input, NumberInput } from '@biosstel/ui';
import { useInventory } from '../../../data-access';

export function InventoryPage() {
  const { data, loading, error, fetchInventory: loadData, updateItem, mutationLoading: editSubmitting, mutationError: editError } = useInventory();
  const items = data?.items ?? [];
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editCodigo, setEditCodigo] = useState('');
  const [editNombre, setEditNombre] = useState('');
  const [editCantidad, setEditCantidad] = useState<number>(0);
  const [editUbicacion, setEditUbicacion] = useState('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setEditCodigo(item.codigo ?? '');
    setEditNombre(item.nombre ?? '');
    setEditCantidad(typeof item.cantidad === 'number' ? item.cantidad : 0);
    setEditUbicacion(item.ubicacion ?? '');
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    logUserAction('inventory_update_item', undefined, { itemId: editingItem.id });
    try {
      await updateItem(editingItem.id, {
        codigo: editCodigo.trim(),
        nombre: editNombre.trim(),
        cantidad: Number.isFinite(editCantidad) && editCantidad >= 0 ? editCantidad : 0,
        ubicacion: editUbicacion.trim() || undefined,
      });
      setEditingItem(null);
      loadData();
    } catch {
      // editError from state
    }
  };

  const isEmpty = !loading && !error && items.length === 0;

  return (
    <PageContainer>
      <Stack gap={6}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={1} className="text-gray-900 font-bold">
            Inventario
          </Heading>
          <Button type="button" variant="secondary" onClick={loadData} className="h-[43px] font-semibold border-border-card">
            Refrescar
          </Button>
        </header>

        <Modal open={editingItem != null} onClose={() => setEditingItem(null)} size="m">
          <Stack gap={4}>
            <Text as="h2" className="text-lg font-semibold text-gray-900">
              Editar item de inventario
            </Text>
            {editError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{editError}</div>
            )}
            <Input
              label="Código"
              value={editCodigo}
              onChange={(e) => setEditCodigo(e.target.value)}
              placeholder="INV-001"
            />
            <Input
              label="Nombre"
              value={editNombre}
              onChange={(e) => setEditNombre(e.target.value)}
              placeholder="Nombre del item"
            />
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Cantidad</label>
              <NumberInput
                value={editCantidad}
                onChange={(v) => setEditCantidad(v)}
                min={0}
                className="w-full rounded-lg border border-border-card px-3 py-2 text-sm"
              />
            </div>
            <Input
              label="Ubicación"
              value={editUbicacion}
              onChange={(e) => setEditUbicacion(e.target.value)}
              placeholder="Estantería A1"
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={!editCodigo.trim() || !editNombre.trim() || editSubmitting}
                onClick={handleUpdateItem}
              >
                {editSubmitting ? 'Guardando…' : 'Guardar'}
              </Button>
            </div>
          </Stack>
        </Modal>

        <Card className="p-0 overflow-hidden shadow-sm border border-border-card rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Código
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Nombre
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Ubicación
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide w-24">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    Cargando...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {isEmpty && !loading && !error && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Text variant="muted" className="text-muted text-sm">
                      No hay items en el inventario.
                    </Text>
                  </td>
                </tr>
              )}
              {!loading && !error && items.length > 0 &&
                items.map((item) => (
                  <tr key={item.id} className="border-b border-border-card last:border-b-0">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.codigo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.ubicacion ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="secondary"
                        className="!py-1 !text-sm border-border-card"
                        onClick={() => openEditModal(item)}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      </Stack>
    </PageContainer>
  );
}
