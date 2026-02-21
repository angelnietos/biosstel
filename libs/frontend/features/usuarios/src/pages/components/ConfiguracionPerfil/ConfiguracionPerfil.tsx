/**
 * @biosstel/usuarios - ConfiguracionPerfil
 * Formulario: contraseña, teléfono, cuentas contables. Layout Figma.
 */

'use client';

import { useState } from 'react';
import { Card, Text, Button, Input, useToast } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { Link, logUserAction } from '@biosstel/platform';
import { UsersPageLayout } from '../../layouts';

export const ConfiguracionPerfil = () => {
  const { addToast } = useToast();
  const [phone, setPhone] = useState('');
  const handleSavePassword = () => {
    logUserAction('usuarios_perfil_save_password');
    addToast('Contraseña actualizada correctamente.', 'success');
  };
  const handleCancelPassword = () => addToast('Cambios de contraseña cancelados.', 'info');
  const handleSavePhone = () => {
    logUserAction('usuarios_perfil_save_phone', undefined, { phone });
    addToast('Teléfono guardado correctamente.', 'success');
    setPhone('');
  };
  const handleCancelPhone = () => {
    setPhone('');
    addToast('Cambios de teléfono cancelados.', 'info');
  };
  return (
  <UsersPageLayout title="Configuración de perfil">
    <Stack gap={8}>
      <Card className="p-5 border border-border-card shadow-sm rounded-xl">
        <Stack gap={4}>
          <Text variant="body" className="font-semibold text-gray-900">Contraseña</Text>
          <div className="grid gap-3 sm:grid-cols-1">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-muted mb-1">Contraseña actual</label>
              <Input id="current-password" name="current-password" type="password" placeholder="••••••••" className="mt-1" />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-muted mb-1">Nueva contraseña</label>
              <Input id="new-password" name="new-password" type="password" placeholder="••••••••" className="mt-1" />
            </div>
            <div>
              <label htmlFor="repeat-password" className="block text-sm font-medium text-muted mb-1">Repetir nueva contraseña</label>
              <Input id="repeat-password" name="repeat-password" type="password" placeholder="••••••••" className="mt-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={handleSavePassword}>Guardar contraseña</Button>
            <Button type="button" variant="secondary" onClick={handleCancelPassword}>Cancelar</Button>
          </div>
        </Stack>
      </Card>

      <Card className="p-5 border border-border-card shadow-sm rounded-xl">
        <Stack gap={4}>
          <Text variant="body" className="font-semibold text-gray-900">Teléfono</Text>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-muted mb-1">Número de contacto</label>
            <Input id="phone" name="phone" type="tel" placeholder="+34 600 000 000" className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={handleSavePhone}>Guardar teléfono</Button>
            <Button type="button" variant="secondary" onClick={handleCancelPhone}>Cancelar</Button>
          </div>
        </Stack>
      </Card>

      <Card className="p-5 border border-border-card shadow-sm rounded-xl">
        <Stack gap={4}>
          <Text variant="body" className="font-semibold text-gray-900">Cuentas contables</Text>
          <Text variant="small" className="text-muted">Códigos de facturación asociados a tu perfil.</Text>
          <div className="border border-border-card rounded-lg p-4 min-h-[80px]">
            <Text variant="muted">Sin cuentas asignadas. Añadir desde Empresa → Cuentas contables.</Text>
          </div>
          <Link href="/empresa/cuentas-contables" className="inline-flex items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Ir a Cuentas contables
          </Link>
        </Stack>
      </Card>
    </Stack>
  </UsersPageLayout>
  );
};

export default ConfiguracionPerfil;
