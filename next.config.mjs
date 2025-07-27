/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Ignore problematic image files
    unoptimized: true,
    loader: 'default',
  },
  serverExternalPackages: ['cloudinary'],
  // Increase file upload limits
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb' // Increased from default 1mb to 10mb
    }
  },
  // Ignore specific files during build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Ignore buyerloop images
    config.module.rules.push({
      test: /buyerloop.*\.(png|jpg|jpeg|gif|svg)$/,
      use: 'ignore-loader'
    })
    
    return config
  },
}

export default nextConfig
