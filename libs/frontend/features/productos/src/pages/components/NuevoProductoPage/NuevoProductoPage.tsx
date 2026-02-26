'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, logFormSubmit } from '@biosstel/platform';
import { useDispatch, useSelector } from 'react-redux';
import { type ThunkDispatch, type Action } from '@reduxjs/toolkit';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Button, Input, Card, Modal, Text, PlusIcon } from '@biosstel/ui';
import { createProductoThunk, type ProductosState } from '../../../data-access';

const DEPARTAMENTOS_OPTIONS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Comercial', value: 'comercial' },
  { label: 'Departamento 2', value: 'depto2' },
  { label: 'Tiendas', value: 'tiendas' },
];

export interface NuevoProductoPageProps {
  /** Path to redirect after create (e.g. list of products) */
  productsListPath: string;
}

export function NuevoProductoPage({ productsListPath }: NuevoProductoPageProps) {
  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, Action>>();
  const { mutationLoading: loading, mutationError: error } = useSelector((state: { productos: ProductosState }) => state.productos);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [familia, setFamilia] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [subirPlantillaOpen, setSubirPlantillaOpen] = useState(false);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const addDeptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addDeptRef.current && !addDeptRef.current.contains(e.target as Node)) setAddDeptOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logFormSubmit('productos_nuevo', undefined, { codigo, nombre, familia, estado });
    try {
      await dispatch(createProductoThunk({ codigo, nombre, familia, estado })).unwrap();
      window.dispatchEvent(new CustomEvent('productos-list-invalidate'));
      router.push(productsListPath);
    } catch {
      // error from state
    }
  };

  return (
    <PageContainer>
      <Stack gap={6}>
        <Heading level={1} className="text-gray-900 font-bold">
          Añadir producto
        </Heading>
        <Card className="p-5 shadow-sm border border-border-card rounded-xl max-w-lg">
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-muted mb-1">
                  Código / Referencia
                </label>
                <Input
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                  className="w-full"
                  placeholder="REF-001"
                />
              </div>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-muted mb-1">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label htmlFor="familia" className="block text-sm font-medium text-muted mb-1">
                  Familia
                </label>
                <Input
                  id="familia"
                  value={familia}
                  onChange={(e) => setFamilia(e.target.value)}
                  className="w-full"
                  placeholder="Familia"
                />
              </div>
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-muted mb-1">
                  Estado
                </label>
                <select
                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full rounded-lg border border-border-card px-3 py-2 text-sm text-gray-900 bg-white"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="border-border-card"
                  onClick={() => router.push(productsListPath)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Guardando…' : 'Crear producto'}
                </Button>
              </div>
            </Stack>
          </form>
        </Card>

        {/* Figma Base-4 a Base-6: asignaciones departamento + modal Subir plantilla */}
        <Card className="p-5 shadow-sm border border-border-card rounded-xl max-w-lg">
          <Stack gap={4}>
            <div className="flex items-center justify-between">
              <Text variant="body" className="font-semibold text-gray-900">
                Asignaciones departamento
              </Text>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSubirPlantillaOpen(true)}
                className="border-border-card"
              >
                Subir plantilla
              </Button>
            </div>
            {departamentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-border-card rounded-xl bg-gray-50/50">
                <Text variant="body" className="text-muted font-medium text-center mb-2">
                  Por favor añade los departamentos para asignar objetivos a este producto.
                </Text>
                <div ref={addDeptRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAddDeptOpen((o) => !o)}
                    className="inline-flex h-[36px] items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Añadir Departamentos
                    <PlusIcon white className="w-4 h-4" />
                  </button>
                  {addDeptOpen && (
                    <ul className="absolute left-0 top-full z-10 mt-1 min-w-[200px] rounded-lg bg-white p-2 shadow-xl border border-gray-200">
                      {DEPARTAMENTOS_OPTIONS.map((opt) => (
                        <li key={opt.value}>
                          <button
                            type="button"
                            onClick={() => {
                              setDepartamentos((prev) => [...prev, opt.label]);
                              setAddDeptOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {departamentos.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                  >
                    {d}
                  </span>
                ))}
                <div ref={addDeptRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAddDeptOpen((o) => !o)}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-border-card bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Añadir
                    <PlusIcon className="w-3 h-3 text-gray-500" />
                  </button>
                  {addDeptOpen && (
                    <ul className="absolute left-0 top-full z-10 mt-1 min-w-[200px] rounded-lg bg-white p-2 shadow-xl border border-gray-200">
                      {DEPARTAMENTOS_OPTIONS.filter((o) => !departamentos.includes(o.label)).map((opt) => (
                        <li key={opt.value}>
                          <button
                            type="button"
                            onClick={() => {
                              setDepartamentos((prev) => [...prev, opt.label]);
                              setAddDeptOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </Stack>
        </Card>

        <Modal open={subirPlantillaOpen} onClose={() => setSubirPlantillaOpen(false)} size="s">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Subir plantilla</h2>
          <p className="text-sm text-muted mb-4">
            Selecciona un documento con la plantilla de objetivos para cargar.
          </p>
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">Documento</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white file:font-medium"
            />
          </label>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setSubirPlantillaOpen(false)} className="border-border-card">
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={() => setSubirPlantillaOpen(false)}>
              Cargar documento
            </Button>
          </div>
        </Modal>
      </Stack>
    </PageContainer>
  );
}
