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
    return [
      {
        source: "/api/predict",
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/predict`
          : "http://localhost:8000/predict",
      },
    ];
  },
};

module.exports = nextConfig;
