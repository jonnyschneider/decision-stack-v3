
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  }
}

module.exports = nextConfig