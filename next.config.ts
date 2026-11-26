import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Synsera MVP is a client-localStorage demo. Cache Components + instant
  // navigation validation fights AuthGate (client session) and was dropping
  // workspace page segments — Blaise saw "nothing works". Keep this off until
  // server sessions exist.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
