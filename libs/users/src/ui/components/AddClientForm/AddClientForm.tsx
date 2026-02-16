/**
 * @biosstel/users - AddClientForm Component
 */

'use client';

import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Input, ErrorFormMsg } from '@biosstel/ui';
import { Button } from '@biosstel/shared';
import { PageContainer } from '@biosstel/ui-layout';
import * as Yup from 'yup';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export interface AddClientFormProps {
  onSubmit: (values: {
    name: string;
    email: string;
    phone: string;
  }) => Promise<void>;
}

export const AddClientForm = ({ onSubmit }: AddClientFormProps) => {
  const t = useTranslations();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('form.isRequired')),
    email: Yup.string()
      .email('Email inválido')
      .required(t('form.isRequired')),
    phone: Yup.string().required(t('form.isRequired')),
  });

  return (
    <PageContainer>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Agregar Cliente</h1>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <Formik
          validateOnChange={false}
          initialValues={{
            name: '',
            email: '',
            phone: '',
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

              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                fullWidth
                className="mt-4"
              >
                Crear Cliente
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </PageContainer>
  );
};

export default AddClientForm;
