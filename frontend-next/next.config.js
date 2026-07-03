/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // In production, set NEXT_PUBLIC_API_URL to your Railway backend URL
    // Must include protocol: https://your-backend.railway.app
    // Falls back to localhost:8000 in development
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const apiUrl =
      rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
        ? rawUrl
        : 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
