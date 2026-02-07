import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
