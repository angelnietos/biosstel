/**
 * @biosstel/auth - EmailSendMessage Component
 */

'use client';

import { Link } from '@biosstel/platform';
import { Button } from '@biosstel/shared';

export const EmailSendMessage = () => {
  return (
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
      <Link href="/login">
        <Button fullWidth>Volver al login</Button>
      </Link>
    </div>
  );
};

export default EmailSendMessage;
