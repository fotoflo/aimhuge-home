import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "cnnttsihfbyxhzlmzdtv.supabase.co",
      },
    ],
  },
};

export default nextConfig;
