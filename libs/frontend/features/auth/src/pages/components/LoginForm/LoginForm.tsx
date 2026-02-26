/**
 * @biosstel/auth - LoginForm
 * Componente de dominio auth. Usa solo @biosstel/ui, @biosstel/ui-layout, @biosstel/platform.
 */

'use client';

import { useState } from 'react';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter, Link, logFormSubmit } from '@biosstel/platform';
import * as Yup from 'yup';
import { Input, InputPassword, ErrorFormMsg, Button, Alert } from '@biosstel/ui';
import { Stack, Form } from '@biosstel/ui-layout';
import { AuthPageLayout } from '../../layouts';
import { useLogin } from '../../..';

export interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const t = useTranslations();
  const { login, error: loginError } = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('form.invalidEmail')).required(t('form.isRequired')),
    password: Yup.string().required(t('form.isRequired')).min(6, t('form.minSixCharacters')),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setSubmitError(null);
    logFormSubmit('login', undefined, { email: values.email });
    try {
      await login({ email: values.email, password: values.password });
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/home');
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <AuthPageLayout title={t('loginPage.title')}>
      <Formik
        validateOnChange={false}
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {(submitError || loginError) && (
                <Alert variant="error">{submitError || loginError}</Alert>
              )}
              <Stack gap={1}>
                <Input
                  name="email"
                  type="email"
                  placeholder={t('loginPage.firstInput')}
                  value={values.email}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  error={Boolean(errors.email)}
                  label={t('loginPage.firstInput')}
                />
                <ErrorFormMsg errorMsg={errors.email} />
              </Stack>
              <Stack gap={1}>
                <InputPassword
                  name="password"
                  placeholder={t('loginPage.secondInput')}
                  value={values.password}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  containerClassName="w-full"
                  error={Boolean(errors.password)}
                  label={t('loginPage.secondInput')}
                />
                <ErrorFormMsg errorMsg={errors.password} />
                <Link href="/forgot-password">{t('form.forgotPassword')}</Link>
              </Stack>
              <Button
                type="submit"
                variant="primaryLg"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {t('loginPage.BtnSend')}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default LoginForm;
