import type { Product, ProductStatus } from "@/types/catalog";

export function productStatusTone(status: ProductStatus) {
  return status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : "neutral";
}

export function productStatusLabel(status: ProductStatus) {
  return status === "ACTIVE" ? "فعال" : status === "DRAFT" ? "پیش نویس" : "آرشیو";
}

export function formatProductPrice(product: Product) {
  const prices = product.variants.map((variant) => variant.price);
  if (!prices.length) return "بدون قیمت";
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} تا ${formatPrice(maxPrice)}`;
}


export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} Toman`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
