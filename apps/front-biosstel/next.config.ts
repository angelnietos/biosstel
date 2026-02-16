import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  // Turbopack is now the default in Next.js 16
  // No need to configure it explicitly
  
  // Standalone output for Docker
  output: 'standalone',
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
