/**
 * @biosstel/platform - Next.js Link Adapter
 * 
 * This adapter wraps Next.js Link to provide a consistent API.
 * It allows features to use routing without depending directly on Next.js.
 * 
 * If you switch to another framework (Remix, React Router, etc.),
 * you only need to change this adapter, not your feature code.
 */

import NextLink from 'next/link';
import { ReactNode, AnchorHTMLAttributes } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
}

/**
 * Platform-agnostic Link component.
 * Uses Next.js Link internally but can be swapped for another router.
 */
export const Link = ({
  href,
  children,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  ...rest
}: LinkProps) => {
  return (
    <NextLink
      href={href}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
      locale={locale}
      {...rest}
    >
      {children}
    </NextLink>
  );
};

export default Link;
