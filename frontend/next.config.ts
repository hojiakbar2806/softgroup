import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: [
      "123.0.0.1",
      "localhost",
      "127.0.0.1",
      "templates.softgroup.uz",
      "api.softgroup.uz",
    ],
  },
};

export default withNextIntl(nextConfig);
