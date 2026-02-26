/**
 * @biosstel/shared - BlockLink
 * Link sin estilo de texto (para envolver cards/bloques). Usa platform Link.
 */

import React, { ReactNode } from 'react';
import { Link } from '@biosstel/platform';

export interface BlockLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const blockLinkClass = 'block text-inherit no-underline';

export const BlockLink = ({ href, children, className = '' }: BlockLinkProps) => (
  <Link href={href} className={`${blockLinkClass} ${className}`.trim()}>
    {children}
  </Link>
);

export default BlockLink;
