import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['api.arasaac.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.arasaac.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
