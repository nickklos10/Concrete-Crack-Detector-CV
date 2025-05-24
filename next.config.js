/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },
  async rewrites() {
    return [
      {
        source: "/api/predict",
        destination: "http://localhost:8000/predict",
      },
    ];
  },
};

module.exports = nextConfig;
