import type { NextConfig } from "next";

// Always bake production URLs — never read localhost from .env on the server
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "https://almasagency.com/api",
    NEXT_PUBLIC_ADMIN_API_KEY:
      process.env.NEXT_PUBLIC_ADMIN_API_KEY ||
      process.env.ADMIN_API_KEY ||
      "almasa_secret_key_2025",
  },
};

export default nextConfig;
