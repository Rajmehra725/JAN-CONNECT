import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.BACKEND_PROXY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://jan-connect-backend.onrender.com";

const cleanBackend = BACKEND_URL.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${cleanBackend}/api/v1/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${cleanBackend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
