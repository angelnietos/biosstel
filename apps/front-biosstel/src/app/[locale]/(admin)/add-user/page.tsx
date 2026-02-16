'use client';

import { Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Input, ErrorFormMsg } from '@biosstel/ui';
import * as Yup from 'yup';

const inputStyles =
  'h-[43px] w-full rounded-lg border border-border-input bg-transparent px-3 text-body';

export default function AddUserPage() {
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

  const handleSubmit = async (values: {
    name: string;
    email: string;
    last_name: string;
    phone: string;
    role: string;
  }) => {
    console.log('Add user:', values);
    // TODO: Implementar lógica de creación de usuario
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Agregar Usuario</h1>

      <div className="rounded-lg bg-white p-6 shadow-md">
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
          onSubmit={handleSubmit}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 h-[43px] w-full rounded-lg bg-black text-body text-white transition-all duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
              >
                {isSubmitting ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
