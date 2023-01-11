/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['raw.githubusercontent.com'] },
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
}

module.exports = nextConfig
