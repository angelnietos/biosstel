'use client';

import { useState, useEffect } from 'react';
import { useRouter, logFormSubmit } from '@biosstel/platform';
import { useDispatch, useSelector } from 'react-redux';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Button, Input, Card, Text, Skeleton } from '@biosstel/ui';
import { fetchProductoById, updateProductoThunk, clearCurrentProduct, type ProductosState } from '../../../data-access';

export interface EditarProductoPageProps {
  productId: string;
  /** Path to redirect after save (e.g. list of products) */
  productsListPath: string;
}

export function EditarProductoPage({ productId, productsListPath }: EditarProductoPageProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentProduct, currentLoading: loadProduct, currentError: error, mutationLoading: loading, mutationError: mutationErrorState } = useSelector((state: { productos: ProductosState }) => state.productos);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [familia, setFamilia] = useState('');
  const [estado, setEstado] = useState('Activo');

  useEffect(() => {
    if (!productId) return;
    (dispatch as (a: ReturnType<typeof clearCurrentProduct>) => void)(clearCurrentProduct());
    (dispatch as (thunk: ReturnType<typeof fetchProductoById>) => void)(fetchProductoById(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setCodigo(currentProduct.codigo ?? '');
      setNombre(currentProduct.nombre ?? '');
      setFamilia(currentProduct.familia ?? '');
      setEstado(currentProduct.estado ?? 'Activo');
    }
  }, [currentProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logFormSubmit('productos_editar', undefined, { id: productId, codigo, nombre, familia, estado });
    try {
      await (dispatch as (thunk: ReturnType<typeof updateProductoThunk>) => Promise<unknown>)(updateProductoThunk({ id: productId, data: { codigo, nombre, familia, estado } })).unwrap();
      window.dispatchEvent(new CustomEvent('productos-list-invalidate'));
      router.replace(productsListPath);
    } catch {
      // mutationError from state
    }
  };

  const displayError = error ?? mutationErrorState;

  if (productId && loadProduct) {
    return (
      <PageContainer>
        <Stack gap={6}>
          <Skeleton className="h-8 w-48" />
          <Card className="p-5 shadow-sm border border-border-card rounded-xl max-w-lg">
            <Stack gap={4}>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </Stack>
          </Card>
        </Stack>
      </PageContainer>
    );
  }

  if (displayError && !currentProduct && !loadProduct) {
    return (
      <PageContainer>
        <Card className="p-5 shadow-sm border border-border-card rounded-xl">
          <Text variant="body" className="text-red-600">{displayError}</Text>
          <Button type="button" variant="secondary" className="mt-4" onClick={() => router.push(productsListPath)}>
            Volver a Productos
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Stack gap={6}>
        <Heading level={1} className="text-gray-900 font-bold">
          Editar producto
        </Heading>
        <Card className="p-5 shadow-sm border border-border-card rounded-xl max-w-lg">
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {displayError && (
                <p className="text-sm text-red-600">{displayError}</p>
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
                  {loading ? 'Guardando…' : 'Guardar cambios'}
                </Button>
              </div>
            </Stack>
          </form>
        </Card>
      </Stack>
    </PageContainer>
  );
}

export default EditarProductoPage;
