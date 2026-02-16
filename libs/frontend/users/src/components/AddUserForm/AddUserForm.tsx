/**
 * @biosstel/users - AddUserForm Component
 */

'use client';

import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Input, ErrorFormMsg } from '@biosstel/ui';
import { Button } from '@biosstel/shared';
import { UsersPageLayout } from '../layouts';
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
  }) => Promise<void>;
}

export const AddUserForm = ({ onSubmit }: AddUserFormProps) => {
  const t = useTranslations();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('form.isRequired')),
    email: Yup.string()
      .email('Email inválido')
      .required(t('form.isRequired')),
    last_name: Yup.string().required(t('form.isRequired')),
    phone: Yup.string().required(t('form.isRequired')),
    role: Yup.string().required(t('form.isRequired')),
  });

  return (
    <UsersPageLayout title="Agregar Usuario">
        <Formik
          validateOnChange={false}
          initialValues={{
            name: '',
            email: '',
            last_name: '',
            phone: '',
            role: '',
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values, errors, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <div className="flex flex-col gap-1">
                <Input
                  name="role"
                  type="text"
                  placeholder="Rol"
                  value={values.role}
                  onChange={(e) => setFieldValue('role', e.target.value)}
                  className={inputStyles}
                  error={Boolean(errors.role)}
                />
                <ErrorFormMsg errorMsg={errors.role} />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                fullWidth
                className="mt-4"
              >
                Crear Usuario
              </Button>
            </form>
          )}
        </Formik>
    </UsersPageLayout>
  );
};

export default AddUserForm;
