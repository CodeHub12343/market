/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Enable React strict mode for development
  reactStrictMode: true,

  // ✅ Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**.example.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // ✅ Aggressive optimization
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ✅ Turbopack config (Next.js 16+ uses Turbopack by default)
  turbopack: {},

  // ✅ Headers for caching
  headers: async () => {
    return [
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },

  // ✅ Redirects (SEO-friendly)
  redirects: async () => {
    return [];
  },

  // ✅ Rewrites for API proxy
  rewrites: async () => {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // ✅ Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  },

  // ✅ Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tanstack/react-query",
      "styled-components",
    ],
  },

  // ✅ Compression
  compress: true,

  // ✅ Production source maps (for error reporting)
  productionBrowserSourceMaps: process.env.NODE_ENV === "development",

  // ✅ Trailing slashes (for consistency)
  trailingSlash: false,

  // ✅ Output
  output: "standalone",
};

export default nextConfig;
