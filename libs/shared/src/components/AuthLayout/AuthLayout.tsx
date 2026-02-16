/**
 * @biosstel/shared - AuthLayout Component
 * 
 * Shared layout component for authentication pages.
 * Used by multiple auth features (login, forgot-password, etc.)
 */

'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  logoAlt?: string;
}

export const AuthLayout = ({ children, logoAlt = 'Biosstel' }: AuthLayoutProps) => {
  return (
    <main className="mx-auto flex h-screen w-full max-w-7xl p-4">
      <section className="relative flex h-full w-full items-center justify-center">
        <Image
          src="/images/logo.png"
          alt={logoAlt}
          className="absolute left-4 top-4 md:left-8 md:top-8"
          width={100}
          height={32}
        />
        {children}
      </section>

      <aside className="relative hidden h-full w-full md:block">
        <Image
          src="/images/background.png"
          alt="Background"
          fill
          className="rounded-20 object-cover"
          sizes="50vw"
        />
      </aside>
    </main>
  );
};

export default AuthLayout;
