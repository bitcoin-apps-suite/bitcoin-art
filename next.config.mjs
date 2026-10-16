/** @type {import('next').NextConfig} */
const FRAME_ANCESTORS =
  "frame-ancestors 'self' capacitor://localhost https://localhost https://web.bwalletx.com https://desktop.bwalletx.com";

const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  transpilePackages: ['@bitcoin-os/bridge'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'Content-Security-Policy', value: FRAME_ANCESTORS }] }];
  },
};

export default nextConfig;
