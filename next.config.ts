import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    serverMinification: true,
  },
};

export default nextConfig;
