import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  // Turbopack is now the default in Next.js 16
  // No need to configure it explicitly
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
