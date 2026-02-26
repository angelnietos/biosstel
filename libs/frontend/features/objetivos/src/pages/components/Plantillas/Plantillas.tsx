/**
 * @biosstel/objetivos - Plantillas
 * Gestión de plantillas de objetivos y carga Excel/CSV. Layout Figma.
 */

'use client';

import { useState } from 'react';
import { Card, Heading, Text, Button } from '@biosstel/ui';
import { PageContainer, Stack } from '@biosstel/ui-layout';

export const Plantillas = () => {
  const [uploading, setUploading] = useState(false);

  const handleCargar = () => {
    setUploading(true);
    setTimeout(() => setUploading(false), 800);
  };

  const handleDescargarEjemplo = () => {
    const blob = new Blob(
      ['Departamento;Centro;Objetivo;Logrado\nComercial;Centro 1;1000;0\nTienda;Centro 2;500;0'],
      { type: 'text/csv;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-objetivos-ejemplo.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer maxWidth="lg">
      <Stack gap={6}>
        <Heading level={1} className="text-gray-900 font-bold">
          Plantillas Objetivos
        </Heading>
        <Text variant="body" className="text-muted">
          Carga plantillas en Excel o CSV para importar objetivos. Descarga la plantilla ejemplo para ver el formato.
        </Text>

        <Card className="p-5 shadow-sm border border-border-card rounded-xl">
          <Stack gap={4}>
            <Heading level={2} className="text-gray-900 font-semibold text-lg">
              Cargar plantilla
            </Heading>
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-table-header p-8 text-center">
              <p className="text-sm text-muted mb-4">
                Arrastra aquí un archivo Excel o CSV, o haz clic para seleccionar
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCargar}
                disabled={uploading}
              >
                {uploading ? 'Subiendo…' : 'Seleccionar archivo'}
              </Button>
            </div>
            <span className="self-start">
              <Button
                type="button"
                variant="raw"
                className="!p-0 !bg-transparent !border-0 text-sm font-medium text-accent-blue hover:underline"
                onClick={() => {}}
              >
                Descargar plantilla ejemplo
              </Button>
            </span>
          </Stack>
        </Card>

        <Card className="p-5 shadow-sm border border-border-card rounded-xl overflow-hidden">
          <Stack gap={4}>
            <Heading level={2} className="text-gray-900 font-semibold text-lg">
              Plantillas cargadas
            </Heading>
            <div className="border border-border-card rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-card bg-table-header">
                    <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="px-4 py-12 text-center text-sm text-muted">
                      No hay plantillas cargadas. Arrastra un archivo o usa «Seleccionar archivo» arriba para cargar la primera.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Stack>
        </Card>
      </Stack>
    </PageContainer>
  );
};

export default Plantillas;
