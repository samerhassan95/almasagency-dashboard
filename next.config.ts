import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://almasagency.com/api",
    NEXT_PUBLIC_ADMIN_API_KEY:
      process.env.NEXT_PUBLIC_ADMIN_API_KEY || "almasa_secret_key_2025",
  },
};

export default nextConfig;
