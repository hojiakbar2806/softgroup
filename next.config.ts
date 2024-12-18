import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  metadataBase: new URL("http://softgroup.uz"), 
};

export default withNextIntl(nextConfig);
