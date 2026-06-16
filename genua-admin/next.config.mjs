/** @type {import('next').NextConfig} */
const adminOrigin = process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.replace(/\/$/, '');

const nextConfig = {
  assetPrefix: adminOrigin || undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xawqrlillkfjzjxpnjqe.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
