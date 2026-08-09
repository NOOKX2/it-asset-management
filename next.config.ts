import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for Docker self-hosting; Vercel uses its own output pipeline.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
