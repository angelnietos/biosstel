'use client';

import Image from 'next/image';
import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Input, InputPassword, ErrorFormMsg } from '@biosstel/ui';
import { MainContainer } from '@biosstel/ui-layout';
import { useLoginSchema } from '../../../../hooks/formValidations/useLoginSchema';
import { Link } from '../../../../i18n/routing';
import PATHS from '../../../../constants/paths';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations();
  const validationSchema = useLoginSchema();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      // Llamar al endpoint de usuarios con paginación
      const response = await fetch('http://localhost:4000/api/users?page=1&pageSize=100', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al conectar con el servidor');
      }

      const data = await response.json();
      // El endpoint devuelve { items: [...], total, page, pageSize } según PaginatedResult
      const users = data.items || data.data || (Array.isArray(data) ? data : []);
      
      // Buscar usuario por email/username
      const user = users.find((u: any) => 
        u.email === values.username || u.email === values.username
      );

      if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // Por ahora, solo verificamos que el usuario existe
      // TODO: Implementar verificación de contraseña con bcrypt en el backend
      console.log('Login exitoso:', user);
      
      // Redirigir a dashboard o página principal
      const currentPath = window.location.pathname;
      const locale = currentPath.split('/')[1] || 'es';
      router.push(`/${locale}/users`);
      
    } catch (err: any) {
      console.error('Login error:', err);
      // El error se manejará a través de Formik
      throw err;
    }
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
            {t('loginPage.title')}
          </h1>

          <Formik
            validateOnChange={false}
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, errors, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <Input
                    name="username"
                    type="text"
                    placeholder={t('loginPage.firstInput')}
                    value={values.username}
                    onChange={(e) => setFieldValue('username', e.target.value)}
                    className={inputStyles}
                    error={Boolean(errors.username)}
                  />
                  <ErrorFormMsg errorMsg={errors.username} />
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
                    href={PATHS.FORGOT_PASSWORD}
                    className="self-end text-mid font-semibold text-gray-800 underline"
                  >
                    {t('form.forgotPassword')}
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 h-[43px] w-full rounded-lg bg-black text-body text-white transition-all duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                >
                  {isSubmitting ? t('loginPage.BtnSend') + '...' : t('loginPage.BtnSend')}
                </button>
              </form>
            )}
          </Formik>
        </MainContainer>
      </section>

      <aside className="relative hidden h-full w-full md:block">
        <Image
          src="/images/background.png"
          alt="Login image"
          fill
          className="rounded-20 object-cover"
          sizes="50vw"
        />
      </aside>
    </main>
  );
}
