import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "v2.exercisedb.io",
      },
      {
        protocol: "https",
        hostname: "*.exercisedb.io",
      },
    ],
  },
};

export default nextConfig;
