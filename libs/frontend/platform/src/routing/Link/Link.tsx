/**
 * @biosstel/platform - Next.js Link Adapter with next-intl support
 * 
 * This adapter wraps next-intl Link to provide a consistent API.
 * It allows features to use routing without depending directly on Next.js.
 * 
 * If you switch to another framework (Remix, React Router, etc.),
 * you only need to change this adapter, not your feature code.
 */

'use client';

import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { ReactNode, AnchorHTMLAttributes } from 'react';

// Define routing configuration
const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
});

// Create navigation with Link
const { Link: NextIntlLink } = createNavigation(routing);

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
 * Uses next-intl Link internally but can be swapped for another router.
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
    <NextIntlLink
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
    </NextIntlLink>
  );
};

export default Link;
