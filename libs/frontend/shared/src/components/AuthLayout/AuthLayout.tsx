/**
 * @biosstel/shared - AuthLayout
 *
 * Layout for auth pages (login, forgot-password, etc.).
 * Does NOT import Next.js; the app passes logo/background URLs.
 */

'use client';

import { ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  logoAlt?: string;
  /** URL for logo image (e.g. /images/logo.png). If not set, logo is not rendered. */
  logoSrc?: string;
  /** URL for right-side background image. If not set, aside is not rendered. */
  backgroundSrc?: string;
}

export const AuthLayout = ({
  children,
  logoAlt = 'Biosstel',
  logoSrc,
  backgroundSrc,
}: AuthLayoutProps) => {
  return (
    <main className="mx-auto flex h-screen w-full max-w-7xl p-4">
      <section className="relative flex h-full w-full items-center justify-center">
        {logoSrc && (
          <img
            src={logoSrc}
            alt={logoAlt}
            className="absolute left-4 top-4 md:left-8 md:top-8 h-8 w-auto object-contain object-left"
          />
        )}
        {children}
      </section>

      {backgroundSrc && (
        <aside className="relative hidden h-full w-full md:block">
          <img
            src={backgroundSrc}
            alt=""
            className="absolute inset-0 h-full w-full rounded-20 object-cover"
          />
        </aside>
      )}
    </main>
  );
};

export default AuthLayout;
