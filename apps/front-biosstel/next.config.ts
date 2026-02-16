import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
