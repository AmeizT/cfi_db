import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // typedRoutes: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  experimental: {
    typedEnv: true,
    globalNotFound: true,
    preloadEntriesOnStart: false,
    serverSourceMaps: false,
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },

  productionBrowserSourceMaps: false,

  // 3. Force webpack to save cache on disk instead of physical memory
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.cache = {
        type: 'filesystem',
      };
    }
    return config;
  },

}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)



