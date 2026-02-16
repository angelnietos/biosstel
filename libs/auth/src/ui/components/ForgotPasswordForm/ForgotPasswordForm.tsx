/**
 * @biosstel/auth - ForgotPasswordForm Component
 */

'use client';

import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Input, ErrorFormMsg } from '@biosstel/ui';
import { MainContainer } from '@biosstel/ui-layout';
import { Button } from '@biosstel/shared';
import * as Yup from 'yup';
import { Link } from '@biosstel/platform';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export interface ForgotPasswordFormProps {
  onSubmit: (values: { email: string }) => Promise<void>;
}

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
  const t = useTranslations();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required(t('form.isRequired')),
  });

  return (
    <MainContainer>
      <h1 className="mb-8 text-h1 font-semibold text-black md:text-datos">
        Recuperar contraseña
      </h1>

      <Formik
        validateOnChange={false}
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, errors, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              fullWidth
              className="mt-4"
            >
              Enviar
            </Button>
            <Link
              href="/login"
              className="self-center text-mid font-semibold text-gray-800 underline"
            >
              Volver al login
            </Link>
          </form>
        )}
      </Formik>
    </MainContainer>
  );
};

export default ForgotPasswordForm;
