import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "striking-bell-1f63db83d6.strapiapp.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
