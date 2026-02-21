/**
 * @biosstel/auth - ForgotPasswordForm
 * Usa solo @biosstel/ui, @biosstel/ui-layout, @biosstel/platform.
 */

'use client';

import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Link } from '@biosstel/platform';
import { Input, ErrorFormMsg, Button } from '@biosstel/ui';
import { Stack, Form } from '@biosstel/ui-layout';
import { AuthPageLayout } from '../../layouts';
import * as Yup from 'yup';

export interface ForgotPasswordFormProps {
  onSubmit: (values: { email: string }) => Promise<void>;
}

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
  const t = useTranslations();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required(t('form.isRequired')),
  });

  return (
    <AuthPageLayout title="Recuperar contraseña">
      <Formik
        validateOnChange={false}
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values, errors, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Stack gap={1}>
                <Input
                  name="email"
                  type="email"
                  placeholder="Correo electrónico"
                  value={values.email}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  error={Boolean(errors.email)}
                />
                <ErrorFormMsg errorMsg={errors.email} />
              </Stack>
              <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} fullWidth>
                Enviar
              </Button>
              <Link href="/login">Volver al login</Link>
            </Stack>
          </Form>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default ForgotPasswordForm;
