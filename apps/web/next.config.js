/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@smartedu/shared', '@smartedu/db'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

module.exports = nextConfig;
