/**
 * @biosstel/shared - ButtonLink
 * Link con apariencia de botón primario. Usa platform Link.
 */

import React, { ReactNode } from 'react';
import { Link } from '@biosstel/platform';

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const buttonLinkClass =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-900 transition-colors no-underline';

export const ButtonLink = ({ href, children, className = '' }: ButtonLinkProps) => (
  <Link href={href} className={`${buttonLinkClass} ${className}`.trim()}>
    {children}
  </Link>
);

export default ButtonLink;
