import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    // Allow larger video uploads through admin portal route handlers / server actions.
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
