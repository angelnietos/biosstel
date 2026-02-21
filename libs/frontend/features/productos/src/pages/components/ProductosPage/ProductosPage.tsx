'use client';

import { useEffect, useCallback } from 'react';
import type { Product } from '@biosstel/shared-types';
import { Link, usePathname } from '@biosstel/platform';
import { PageContainer, Stack } from '@biosstel/ui-layout';
import { Heading, Text, Card } from '@biosstel/ui';
import { useProductos } from '../../../data-access';

export interface ProductosPagePaths {
  inventory: string;
  newProduct: string;
}

export interface ProductosPageProps {
  paths: ProductosPagePaths;
}

export function ProductosPage({ paths }: ProductosPageProps) {
  const pathname = usePathname();
  const { data, loading, error, fetchProductos } = useProductos();
  const productos = data?.products ?? [];

  const refetch = useCallback(
    (options?: { cacheBust?: boolean }) => {
      fetchProductos(options);
    },
    [fetchProductos]
  );

  // Refetch when we land on the list page (e.g. after returning from edit). Use cacheBust to avoid stale list.
  const isListPage = pathname != null && pathname.endsWith('/productos');
  useEffect(() => {
    if (isListPage) {
      refetch({ cacheBust: true });
    }
  }, [isListPage, refetch]);

  // Refetch when edit page signals that a product was saved (fallback so list always reflects changes).
  useEffect(() => {
    const onInvalidate = () => {
      refetch({ cacheBust: true });
    };
    window.addEventListener('productos-list-invalidate', onInvalidate);
    return () => window.removeEventListener('productos-list-invalidate', onInvalidate);
  }, [refetch]);

  const isEmpty = !loading && !error && productos.length === 0;

  return (
    <PageContainer>
      <Stack gap={6}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={1} className="text-gray-900 font-bold">
            Productos
          </Heading>
          <div className="flex items-center gap-2">
            <Link
              href={paths.inventory}
              className="inline-flex items-center justify-center h-[43px] min-w-[100px] px-4 rounded-lg font-semibold text-sm text-gray-900 border border-border-card bg-white hover:bg-gray-50"
            >
              Ir al Inventario
            </Link>
            <Link
              href={paths.newProduct}
              className="inline-flex items-center justify-center h-[43px] min-w-[140px] px-4 rounded-lg font-semibold text-sm bg-gray-900 text-white hover:opacity-90"
            >
              Añadir producto
            </Link>
          </div>
        </header>

        <Card className="p-0 overflow-hidden shadow-sm border border-border-card rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-card bg-table-header">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Código / Referencia
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Nombre
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Familia
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                  Estado
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
                    <div className="flex flex-col items-center gap-4">
                      <Text variant="muted" className="text-muted text-sm">
                        No hay productos. Añade uno o gestiona el catálogo desde el inventario.
                      </Text>
                      <div className="flex flex-wrap justify-center gap-2">
                        <Link
                          href={paths.inventory}
                          className="inline-flex items-center justify-center h-[43px] px-4 rounded-lg font-semibold text-sm border border-border-card bg-white text-gray-900 hover:bg-gray-50"
                        >
                          Ir al Inventario
                        </Link>
                        <Link
                          href={paths.newProduct}
                          className="inline-flex items-center justify-center h-[43px] px-4 rounded-lg font-semibold text-sm bg-gray-900 text-white hover:opacity-90"
                        >
                          Añadir producto
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !error && productos.length > 0 &&
                productos.map((p) => (
                  <tr key={p.id} className="border-b border-border-card last:border-b-0">
                    <td className="px-4 py-3 text-sm text-gray-900">{p.codigo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{p.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{p.familia}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{p.estado}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/productos/editar/${p.id}`}
                        className="inline-flex rounded-lg border border-border-card py-1 px-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                      >
                        Editar
                      </Link>
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
