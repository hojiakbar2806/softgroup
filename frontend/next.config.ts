import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["localhost", "127.0.0.1", "templora.uz", "api.softgroup.uz"],
  },
};

export default nextConfig;
