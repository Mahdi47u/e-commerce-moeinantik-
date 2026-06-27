const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
);

export const MEDIA_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:9000",
);

export const SHOP_MEDIA_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SHOP_MEDIA_URL || `${MEDIA_BASE_URL}/shop-media`,
);
