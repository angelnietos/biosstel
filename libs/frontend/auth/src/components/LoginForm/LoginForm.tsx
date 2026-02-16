/**
 * @biosstel/auth - LoginForm Component
 * 
 * Login form component with business logic.
 * Uses shared components and UI atoms.
 */

'use client';

import { useState } from 'react';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Input, InputPassword, ErrorFormMsg } from '@biosstel/ui';
import { AuthPageLayout } from '../../layouts';
import { Button } from '@biosstel/shared';
import { Link } from '@biosstel/platform';
import { useLogin } from '../../data-access';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const t = useTranslations();
  const { login, error: loginError } = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('form.invalidEmail'))
      .required(t('form.isRequired')),
    password: Yup.string()
      .required(t('form.isRequired'))
      .min(6, t('form.minSixCharacters')),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setSubmitError(null);
    try {
      await login({ email: values.email, password: values.password });
      if (onSuccess) {
        onSuccess();
      } else {
        const currentPath = window.location.pathname;
        const locale = currentPath.split('/')[1] || 'es';
        router.push(`/${locale}/home`);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Error al iniciar sesión');
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {(submitError || loginError) && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {submitError || loginError}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Input
                name="email"
                type="email"
                placeholder={t('loginPage.firstInput')}
                value={values.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
                className={inputStyles}
                error={Boolean(errors.email)}
              />
              <ErrorFormMsg errorMsg={errors.email} />
            </div>
            <div className="flex flex-col gap-1">
              <InputPassword
                name="password"
                placeholder={t('loginPage.secondInput')}
                value={values.password}
                onChange={(e) => setFieldValue('password', e.target.value)}
                className={inputStyles}
                containerClassName="w-full"
                error={Boolean(errors.password)}
              />
              <ErrorFormMsg errorMsg={errors.password} />
              <Link
                href="/forgot-password"
                className="self-end text-mid font-semibold text-gray-800 underline"
              >
                {t('form.forgotPassword')}
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              fullWidth
              className="mt-4"
            >
              {t('loginPage.BtnSend')}
            </Button>
          </form>
        )}
      </Formik>
    </AuthPageLayout>
  );
};

export default LoginForm;
