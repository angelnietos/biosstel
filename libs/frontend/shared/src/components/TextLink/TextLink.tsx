/**
 * @biosstel/shared - TextLink
 * Styled navigation link (uses platform Link). Use for in-content links.
 */

import React, { ReactNode } from 'react';
import { Link } from '@biosstel/platform';

export interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const linkClass = 'text-sm text-blue-600 hover:underline font-medium';

export const TextLink = ({ href, children, className = '' }: TextLinkProps) => (
  <Link href={href} className={`${linkClass} ${className}`.trim()}>
    {children}
  </Link>
);

export default TextLink;
