/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains:
      process.env.NODE_ENV === "production"
        ? ["your-production-domain.com"]
        : ["localhost"],
    formats: ["image/webp", "image/avif"],
  },
  async rewrites() {
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/api/predict",
          destination: process.env.API_URL || "http://localhost:8000/predict",
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
