/**
 * @biosstel/users - AddClientForm
 * Componente de dominio: recibe onSubmit por props.
 */

'use client';

import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Input, ErrorFormMsg } from '@biosstel/ui';
import { Button } from '@biosstel/ui';
import { Link, logFormSubmit } from '@biosstel/platform';
import { UsersPageLayout } from '../../layouts';
import * as Yup from 'yup';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export interface AddClientFormProps {
  onSubmit: (values: { name: string; email: string; phone: string }) => Promise<void>;
  /** Ruta de vuelta al cancelar (compañero: getReturnPath(PATHS.ADD_CLIENT)) */
  cancelHref?: string;
}

export const AddClientForm = ({ onSubmit, cancelHref }: AddClientFormProps) => {
  const t = useTranslations();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('form.isRequired')),
    email: Yup.string().email('Email inválido').required(t('form.isRequired')),
    phone: Yup.string().required(t('form.isRequired')),
  });

  return (
    <UsersPageLayout title="Grabar contrato">
      <Formik
        validateOnChange={false}
        initialValues={{
          name: '',
          email: '',
          phone: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          logFormSubmit('usuarios_add_client', undefined, { email: values.email });
          return onSubmit(values);
        }}
      >
        {({ setFieldValue, values, errors, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                name="name"
                type="text"
                placeholder="Nombre del cliente"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.name)}
              />
              <ErrorFormMsg errorMsg={errors.name} />
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

            <div className="mt-4 flex flex-wrap gap-3">
              {cancelHref && (
                <Link
                  href={cancelHref}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-body font-medium text-gray-700 hover:bg-gray-50"
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
                Crear Cliente
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </UsersPageLayout>
  );
};

export default AddClientForm;
