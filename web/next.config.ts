import type { NextConfig } from "next";

const mediaBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:9000").replace(/\/+$/, "");
const shopMediaUrl = new URL(
  process.env.NEXT_PUBLIC_SHOP_MEDIA_URL || `${mediaBaseUrl}/shop-media`,
);

const shopMediaPathname = shopMediaUrl.pathname.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: shopMediaUrl.protocol.replace(":", "") as "http" | "https",
        hostname: shopMediaUrl.hostname,
        port: shopMediaUrl.port,
        pathname: `${shopMediaPathname || ""}/**`,
      },
    ],
  },
};

export default nextConfig;
