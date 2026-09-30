import type { NextConfig } from 'next';

const CDN = process.env.NEXT_PUBLIC_CDN_URL || undefined;

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker (only traced node_modules are copied)
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,

  // Behind Nginx (which already gzips) set DISABLE_NEXT_COMPRESSION=true
  compress: process.env.DISABLE_NEXT_COMPRESSION !== 'true',

  // CDN: hashed JS/CSS/fonts under /_next/static are served from the CDN host
  assetPrefix: CDN,

  // pg / ioredis stay as real Node modules instead of being bundled
  serverExternalPackages: ['pg', 'ioredis'],

  // Lint is not part of the build (no ESLint dependency shipped); types still are
  eslint: { ignoreDuringBuilds: true },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 256, 384],
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Illustrations in /public/art change rarely: cache a week, revalidate in background
        source: '/art/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
};

export default nextConfig;
