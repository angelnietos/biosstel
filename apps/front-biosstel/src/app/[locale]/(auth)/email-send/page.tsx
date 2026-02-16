'use client';

import Image from 'next/image';
import { Link } from '../../../../i18n/routing';
import PATHS from '../../../../constants/paths';

export default function EmailSendPage() {
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
        <div className="w-full max-w-80 px-4 md:max-w-86 md:px-0 text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-h1 font-semibold text-black md:text-datos">
            Email enviado
          </h1>
          <p className="mb-8 text-body text-gray-600">
            Hemos enviado un enlace de recuperación a tu correo electrónico.
            Por favor, revisa tu bandeja de entrada.
          </p>
          <Link
            href={PATHS.LOGIN}
            className="inline-block h-[43px] w-full rounded-lg bg-black text-body text-white transition-all duration-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Volver al login
          </Link>
        </div>
      </section>

      <aside className="relative hidden h-full w-full md:block">
        <Image
          src="/images/background.png"
          alt="Email send background"
          fill
          className="rounded-20 object-cover"
          sizes="50vw"
        />
      </aside>
    </main>
  );
}
