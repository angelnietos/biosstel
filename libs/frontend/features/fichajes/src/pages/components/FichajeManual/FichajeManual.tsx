/**
 * @biosstel/fichajes - FichajeManual
 * Alta/corrección de registros entrada/salida por administrador. Layout Figma.
 */

'use client';

import { Card, Text, Button, Input, useToast } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { FichajesPageLayout } from '../../layouts';

export const FichajeManual = () => {
  const { addToast } = useToast();
  return (
  <FichajesPageLayout title="Fichaje manual">
    <Stack gap={6}>
      <Text variant="body" className="text-muted">
        Corrige o añade registros de entrada/salida para un usuario.
      </Text>
      <Card className="p-5 shadow-sm">
        <Stack gap={4}>
          <Text as="label" className="text-sm font-medium text-gray-900">Usuario</Text>
          <Input name="usuario" placeholder="Seleccionar usuario" className="max-w-xs" />
          <Text as="label" className="text-sm font-medium text-gray-900">Fecha</Text>
          <Input name="fecha" type="date" placeholder="dd/mm/aa" className="max-w-xs" />
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <Stack gap={2}>
              <Text as="label" className="text-sm font-medium text-gray-900">Hora entrada</Text>
              <Input name="horaEntrada" type="time" placeholder="09:00" />
            </Stack>
            <Stack gap={2}>
              <Text as="label" className="text-sm font-medium text-gray-900">Hora salida</Text>
              <Input name="horaSalida" type="time" placeholder="18:00" />
            </Stack>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={() => addToast('Fichaje guardado correctamente.', 'success')}>Guardar fichaje</Button>
            <Button type="button" variant="secondary" onClick={() => addToast('Operación cancelada.', 'info')}>Cancelar</Button>
          </div>
        </Stack>
      </Card>
    </Stack>
  </FichajesPageLayout>
  );
};

export default FichajeManual;
