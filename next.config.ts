import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'doodleipsum.com',
        port: '',
        pathname: '/700/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'crlqlpslzugeloxiwiaj.supabase.co',
        port: '',
        pathname: '/**',
      },
    ]
  }
};

export default nextConfig;
