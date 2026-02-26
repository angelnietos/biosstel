/**
 * @biosstel/empresa - CuentasContables
 * Configuración de códigos de facturación. Layout Figma. Datos desde API.
 */

'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Text } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { EmpresaPageLayout } from '../../layouts';
import { fetchEmpresa, type EmpresaState } from '../../../data-access';

export const CuentasContables = () => {
  const dispatch = useDispatch();
  const { data, isLoading: loading, error } = useSelector((state: { empresa: EmpresaState }) => state.empresa);
  const cuentas = data?.cuentas ?? [];

  useEffect(() => {
    (dispatch as (thunk: ReturnType<typeof fetchEmpresa>) => void)(fetchEmpresa());
  }, [dispatch]);

  const loadData = () => (dispatch as (thunk: ReturnType<typeof fetchEmpresa>) => void)(fetchEmpresa());
  const isEmpty = !loading && !error && cuentas.length === 0;

  return (
    <EmpresaPageLayout title="Cuentas contables">
      <Stack gap={6}>
        <div className="flex justify-end">
          <Button type="button" variant="primary">Añadir cuenta</Button>
        </div>
        <div className="border border-border-card rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Código</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Descripción</th>
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
              {!loading && !error && cuentas.length > 0 && cuentas.map((c) => (
                <tr key={c.id} className="border-b border-border-card">
                  <td className="px-4 py-3 text-gray-900">{c.code}</td>
                  <td className="px-4 py-3 text-muted">{c.description ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Button type="button" variant="secondary" className="!py-1 !text-sm">Editar</Button>
                  </td>
                </tr>
              ))}
              {isEmpty && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center">
                    <Text variant="muted" className="block mb-4 text-muted">No hay cuentas contables.</Text>
                    <Button type="button" variant="secondary" onClick={loadData}>Añadir cuenta</Button>
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

export default CuentasContables;
