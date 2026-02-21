import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  // Evita error de tipos con catch-all [[...path]] (LayoutRoutes)
  typedRoutes: false,
  typescript: { ignoreBuildErrors: true },
  // Standalone output for Docker
  output: 'standalone',

  // Rutas del compañero (front-biosstel-developer): /addUser → /add-user, /addClient → /add-client
  async redirects() {
    return [
      { source: '/:locale/addUser', destination: '/:locale/add-user', permanent: false },
      { source: '/:locale/addClient', destination: '/:locale/add-client', permanent: false },
    ];
  },

  // Mismo bundler (webpack) en Docker y local. Polling solo cuando hace falta (Docker).
  webpack: (config, { dev, isServer }) => {
    // Resolver 'motion/react' para código en libs/frontend/ui (monorepo)
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'motion/react': path.resolve(__dirname, 'node_modules/motion/dist/es/motion/lib/react.mjs'),
      motion: path.resolve(__dirname, 'node_modules/motion'),
    };
    // En dev, usar polling para que detecte cambios en libs/ (monorepo) y en Windows/WSL
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

let config = withNextIntl(nextConfig);

if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
  config = withSentryConfig(config, {
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
  });
}

export default config;
