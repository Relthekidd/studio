// next.config.js or next.config.cjs (depending on your module type)

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const nextConfig = {
  // ✅ This is Next.js native config
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
};

// ✅ This is PWA plugin config
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
};

let applyPWA = (config) => config;
try {
  const plugin = require('next-pwa');
  applyPWA = plugin(pwaConfig);
} catch {
  console.warn(
    'next-pwa not found, continuing without PWA support. Install it with "npm install next-pwa" to enable.'
  );
}

export default applyPWA(nextConfig);
