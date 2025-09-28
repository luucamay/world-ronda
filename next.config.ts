import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: [
    '*', // Allow all origins in development
    'https://orally-uncitable-burton.ngrok-free.dev',
    'https://*.ngrok-free.dev',
    'https://*.ngrok.io',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  reactStrictMode: false,
  // Allow eval in development mode for Next.js hot reloading
  ...(process.env.NODE_ENV === 'development' && {
    headers: async () => [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https: fonts.googleapis.com fonts.gstatic.com; connect-src 'self' https: wss: ws:;",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-Forwarded-Host, X-Forwarded-Proto, ngrok-skip-browser-warning',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ],
  }),
};

export default nextConfig;
