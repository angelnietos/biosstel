/**
 * @biosstel/users - AddUserForm
 * Figma Base-5: Nombre, Contraseña x2, Rol, Nombre Apellidos, Centro de trabajo (tags), Departamento.
 */

'use client';

import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Input, ErrorFormMsg, Select } from '@biosstel/ui';
import { Button } from '@biosstel/ui';
import { Link, logFormSubmit } from '@biosstel/platform';
import { getDepartments, getWorkCenters } from '@biosstel/shared';
import type { Department, WorkCenter } from '@biosstel/shared-types';
import { UsersPageLayout } from '../../layouts';
import * as Yup from 'yup';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export interface AddUserFormProps {
  onSubmit: (values: {
    name: string;
    email: string;
    last_name: string;
    phone: string;
    role: string;
    password?: string;
    departmentId?: string;
    workCenterId?: string;
  }) => Promise<void>;
  /** Ruta de vuelta al cancelar (compañero: getReturnPath(PATHS.ADD_USER)) */
  cancelHref?: string;
}

export const AddUserForm = ({ onSubmit, cancelHref }: AddUserFormProps) => {
  const t = useTranslations();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => {});
    getWorkCenters().then(setWorkCenters).catch(() => {});
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('form.isRequired')),
    email: Yup.string().email('Email inválido').required(t('form.isRequired')),
    last_name: Yup.string().required(t('form.isRequired')),
    phone: Yup.string().required(t('form.isRequired')),
    role: Yup.string().required(t('form.isRequired')),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required(t('form.isRequired')),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden').required(t('form.isRequired')),
  });

  return (
    <UsersPageLayout title="Añadir Usuario">
      <Formik
        validateOnChange={false}
        initialValues={{
          name: '',
          email: '',
          last_name: '',
          phone: '',
          role: '',
          password: '',
          passwordConfirm: '',
          departmentId: '',
          workCenterId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          logFormSubmit('usuarios_add_user', undefined, { email: values.email, role: values.role });
          return onSubmit(values);
        }}
      >
        {({ setFieldValue, values, errors, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Figma Base-10: aviso rosa permisos cuando rol es Coordinador */}
            {values.role === 'COORDINADOR' && (
              <div className="rounded-xl bg-[#FAE8FF] px-4 py-3 text-sm text-[#D946EF] font-medium border border-[#F5D0FE]">
                Como coordinador/a puedes asignar centros y departamentos. Los usuarios en otras plataformas se pueden vincular más abajo.
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Input
                name="name"
                type="text"
                placeholder="Nombre"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.name)}
              />
              <ErrorFormMsg errorMsg={errors.name} />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="last_name"
                type="text"
                placeholder="Apellidos"
                value={values.last_name}
                onChange={(e) => setFieldValue('last_name', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.last_name)}
              />
              <ErrorFormMsg errorMsg={errors.last_name} />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={values.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.email)}
              />
              <ErrorFormMsg errorMsg={errors.email} />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={values.password}
                onChange={(e) => setFieldValue('password', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.password)}
              />
              <ErrorFormMsg errorMsg={errors.password} />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="passwordConfirm"
                type="password"
                placeholder="Repetir contraseña"
                value={values.passwordConfirm}
                onChange={(e) => setFieldValue('passwordConfirm', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.passwordConfirm)}
              />
              <ErrorFormMsg errorMsg={errors.passwordConfirm} />
            </div>

            <div className="flex flex-col gap-1">
              <Select
                name="role"
                placeholder="Seleccionar Rol"
                value={values.role}
                onChange={(e) => setFieldValue('role', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.role)}
                options={[
                  { label: 'Administrador', value: 'ADMIN' },
                  { label: 'Coordinador/a', value: 'COORDINADOR' },
                  { label: 'Telemarketing', value: 'TELEMARKETING' },
                  { label: 'Tienda', value: 'TIENDA' },
                  { label: 'Comercial', value: 'COMERCIAL' },
                  { label: 'Backoffice', value: 'BACKOFFICE' },
                ]}
              />
              <ErrorFormMsg errorMsg={errors.role} />
            </div>

            <div className="flex flex-col gap-1">
              <Select
                name="departmentId"
                placeholder="Departamento (opcional)"
                value={values.departmentId}
                onChange={(e) => setFieldValue('departmentId', e.target.value)}
                className={inputStyles}
                options={[{ label: '— Sin asignar', value: '' }, ...departments.map((d) => ({ label: d.name, value: d.id }))]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Select
                name="workCenterId"
                placeholder="Centro de trabajo (opcional)"
                value={values.workCenterId}
                onChange={(e) => setFieldValue('workCenterId', e.target.value)}
                className={inputStyles}
                options={[{ label: '— Sin asignar', value: '' }, ...workCenters.map((w) => ({ label: w.name, value: w.id }))]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="phone"
                type="tel"
                placeholder="Teléfono"
                value={values.phone}
                onChange={(e) => setFieldValue('phone', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.phone)}
              />
              <ErrorFormMsg errorMsg={errors.phone} />
            </div>

            {/* Figma Base-10: Usuarios en otras plataformas (coordinador) */}
            {values.role === 'COORDINADOR' && (
              <div className="rounded-xl border border-border-card p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Usuarios en otras plataformas</h3>
                <p className="text-xs text-muted">Añade nombre de usuario/a de otras plataformas para vincular.</p>
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="w-[180px]">
                    <Input placeholder="Usuario" className={inputStyles} />
                  </div>
                  <div className="w-[160px]">
                    <Input type="password" placeholder="Contraseña" className={inputStyles} />
                  </div>
                  <Button type="button" variant="secondary" className="h-[43px] shrink-0">
                    Añadir Nombre de Usuario/a +
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {cancelHref && (
                <Link
                  href={cancelHref}
                  className="inline-flex items-center justify-center rounded-lg border border-border-card bg-white px-4 py-2 text-body font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t('form.cancel') ?? 'Cancelar'}
                </Link>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                fullWidth={!cancelHref}
                className={cancelHref ? '' : 'mt-4'}
              >
                Añadir
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </UsersPageLayout>
  );
};

export default AddUserForm;
