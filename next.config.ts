// next.config.js
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', 
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, // Cache all HTTP/S requests
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offline-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  
};

module.exports = withPWA(nextConfig);
 