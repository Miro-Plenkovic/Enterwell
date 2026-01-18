import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.jsdelivr.net'],
    localPatterns: [
      {
        pathname: '/api/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*' // Proxy to Backend
      }
    ]
  }
};

export default nextConfig;
