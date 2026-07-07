import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  allowedDevOrigins: ['*'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default config;
