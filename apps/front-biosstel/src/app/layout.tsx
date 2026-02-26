import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootLayoutView } from '@biosstel/shell';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

// Evita prerender de /_not-found donde usePathname() no está disponible
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Biosstel',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayoutView bodyClassName={`${inter.variable} antialiased`}>
      {children}
    </RootLayoutView>
  );
}
