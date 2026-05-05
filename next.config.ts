import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // protocol: "http",
        // hostname: "localhost",
        // port: "1337",
        // pathname: "/uploads/**",
        protocol: "https",
        hostname: "nama-project.strapiapp.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;