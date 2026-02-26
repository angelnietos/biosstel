import { getMessages } from 'next-intl/server';
import { Providers } from '../providers';
import { ShellLayout } from '@biosstel/shell';

type Params = Promise<{ path?: string[] }>;

export default async function PathLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { path } = await params;
  const locale = path?.[0] ?? 'es';
  const messages = await getMessages({ locale });

  return (
    <Providers>
      <ShellLayout locale={locale} messages={messages ?? {}}>
        {children}
      </ShellLayout>
    </Providers>
  );
}
