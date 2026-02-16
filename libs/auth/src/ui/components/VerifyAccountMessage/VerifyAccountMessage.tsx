/**
 * @biosstel/auth - VerifyAccountMessage Component
 */

'use client';

import { Button } from '@biosstel/shared';

export interface VerifyAccountMessageProps {
  token?: string | null;
}

export const VerifyAccountMessage = ({ token }: VerifyAccountMessageProps) => {
  return (
    <div className="w-full max-w-80 px-4 md:max-w-86 md:px-0 text-center">
      <div className="mb-8">
        <svg
          className="mx-auto h-16 w-16 text-blue-500"
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
        Verificar cuenta
      </h1>
      <p className="mb-8 text-body text-gray-600">
        {token
          ? 'Tu cuenta ha sido verificada exitosamente.'
          : 'Verificando tu cuenta...'}
      </p>
      <a href="/login">
        <Button fullWidth>Ir al login</Button>
      </a>
    </div>
  );
};

export default VerifyAccountMessage;
