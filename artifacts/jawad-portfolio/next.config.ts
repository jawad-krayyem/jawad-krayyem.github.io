import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: ['**.replit.dev'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
