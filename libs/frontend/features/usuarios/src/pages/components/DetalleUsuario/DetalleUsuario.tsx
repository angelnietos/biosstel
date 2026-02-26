/**
 * @biosstel/usuarios - DetalleUsuario
 * Ficha con datos del usuario + pestañas (Datos, Documentación). Layout Figma.
 * Datos desde API GET /users/:id.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Text, Button, Heading, Tabs, Skeleton } from '@biosstel/ui';
import { Stack } from '@biosstel/ui-layout';
import { Link } from '@biosstel/platform';
import { UsersPageLayout } from '../../layouts';
import { fetchUserById, clearCurrentUser, type UserState } from '../../../data-access';

export interface DetalleUsuarioProps {
  userId?: string;
}

const TAB_DATOS = 'datos';
const TAB_DOC = 'documentacion';

function display(value: string | undefined | null): string {
  return value != null && String(value).trim() !== '' ? String(value).trim() : '—';
}

export const DetalleUsuario = ({ userId }: DetalleUsuarioProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser: user, currentUserLoading: loading, currentUserError: error } = useSelector((state: { users: UserState }) => state.users);
  const [activeTab, setActiveTab] = useState(TAB_DATOS);

  const loadUser = useCallback(() => {
    if (!userId) return;
    (dispatch as (thunk: ReturnType<typeof fetchUserById>) => void)(fetchUserById(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    if (!userId) return;
    (dispatch as (a: ReturnType<typeof clearCurrentUser>) => void)(clearCurrentUser());
    (dispatch as (thunk: ReturnType<typeof fetchUserById>) => void)(fetchUserById(userId));
  }, [userId, dispatch]);

  const tabs = [
    { key: TAB_DATOS, label: 'Datos' },
    { key: TAB_DOC, label: 'Documentación' },
  ];

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || user.email || '—'
    : '—';

  return (
    <UsersPageLayout title="Detalle del usuario">
      <Stack gap={6}>
        <div className="flex items-center gap-4">
          <Link href="/users" className="text-sm font-medium text-muted hover:text-gray-900 underline">
            ← Volver a usuarios
          </Link>
        </div>
        <Card className="p-5 border border-border-card shadow-sm rounded-xl">
          <Stack gap={4}>
            {loading && (
              <Skeleton height="md" className="w-48" />
            )}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100 flex justify-between items-center">
                <span>{error}</span>
                <Button type="button" variant="secondary" className="!py-1" onClick={loadUser}>Reintentar</Button>
              </div>
            )}
            {!loading && !error && (
              <>
                <Heading level={2} className="text-gray-900">
                  {user ? fullName : (userId ? `Usuario #${userId}` : 'Usuario')}
                </Heading>
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-gray-900">
                  <div>
                    <dt className="text-xs font-medium text-muted">Nombre</dt>
                    <dd className="text-sm">{user ? fullName : '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Email</dt>
                    <dd className="text-sm">{display(user?.email)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Departamento</dt>
                    <dd className="text-sm">{display((user as any).departamento)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Centro de trabajo</dt>
                    <dd className="text-sm">{display((user as any).centroTrabajo)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Rol</dt>
                    <dd className="text-sm">{display(user?.role as string)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted">Estado</dt>
                    <dd className="text-sm">{user?.isActive === true ? 'Activo' : user?.isActive === false ? 'Inactivo' : '—'}</dd>
                  </div>
                </dl>
              </>
            )}
          </Stack>
        </Card>

        <Tabs
          tabs={tabs}
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="border-border-card"
        />

        {activeTab === TAB_DATOS && (
          <Card className="p-5 border border-border-card shadow-sm rounded-xl">
            {user ? (
              <Text variant="body" className="text-muted">
                Datos del empleado. Departamento y centro de trabajo se mostrarán cuando estén asignados en el sistema.
              </Text>
            ) : !loading && !error && !userId ? (
              <Text variant="body" className="text-muted">
                Selecciona un usuario desde el listado para ver su detalle.
              </Text>
            ) : null}
          </Card>
        )}

        {activeTab === TAB_DOC && (
          <Card className="p-5 border border-border-card shadow-sm rounded-xl">
            <Stack gap={4}>
              <Text variant="body" className="text-muted">
                Nóminas, contratos y permisos del usuario.
              </Text>
              {userId && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => router.push(`/users/${userId}/documentacion`)}
                >
                  Añadir Documentación +
                </Button>
              )}
            </Stack>
          </Card>
        )}
      </Stack>
    </UsersPageLayout>
  );
};

export default DetalleUsuario;
