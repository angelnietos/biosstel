'use client';

import Image from 'next/image';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Input, ErrorFormMsg } from '@biosstel/ui';
import { MainContainer } from '@biosstel/ui-layout';
import * as Yup from 'yup';
import { Link } from '../../../../i18n/routing';
import PATHS from '../../../../constants/paths';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export default function ForgotPasswordPage() {
  const t = useTranslations();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required(t('form.isRequired')),
  });

  const handleSubmit = async (values: { email: string }) => {
    console.log('Forgot password:', values);
    // TODO: Implementar lógica de recuperación de contraseña
  };

  return (
    <main className="mx-auto flex h-screen w-full max-w-7xl p-4">
      <section className="relative flex h-full w-full items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="Biosstel"
          className="absolute left-4 top-4 md:left-8 md:top-8"
          width={100}
          height={32}
        />
        <MainContainer>
          <h1 className="mb-8 text-h1 font-semibold text-black md:text-datos">
            Recuperar contraseña
          </h1>

          <Formik
            validateOnChange={false}
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 h-[43px] w-full rounded-lg bg-black text-body text-white transition-all duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
                <Link
                  href={PATHS.LOGIN}
                  className="self-center text-mid font-semibold text-gray-800 underline"
                >
                  Volver al login
                </Link>
              </form>
            )}
          </Formik>
        </MainContainer>
      </section>

      <aside className="relative hidden h-full w-full md:block">
        <Image
          src="/images/background.png"
          alt="Forgot password background"
          fill
          className="rounded-20 object-cover"
          sizes="50vw"
        />
      </aside>
    </main>
  );
}
