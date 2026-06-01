import { apiFetch } from "@/lib/api";
import type { Category, Product } from "@/types/catalog";

export function getCategories() {
  return apiFetch<Category[]>("/categories");
}

export function getProducts(categorySlug?: string) {
  const params = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
  return apiFetch<Product[]>(`/products${params}`);
}

export function getProduct(slug: string) {
  return apiFetch<Product>(`/products/${encodeURIComponent(slug)}`);
}
