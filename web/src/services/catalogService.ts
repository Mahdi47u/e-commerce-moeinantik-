import { apiFetch } from "@/lib/api";
import type { Category, Product, ProductStatus } from "@/types/catalog";

export type ProductPayload = {
  name: string;
  slug?: string;
  sku?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: number | null;
  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  variants: Array<{
    title: string;
    sku?: string | null;
    price: number;
    compareAtPrice?: number | null;
    stockQuantity: number;
    active: boolean;
    sortOrder: number;
  }>;
  galleryImages: Array<{
    mediaAssetId: number;
    altText?: string | null;
    primaryImage: boolean;
    sortOrder: number;
  }>;
  attributes: Array<{
    attributeId: number;
    attributeValueId?: number | null;
    valueText?: string | null;
    valueNumber?: number | null;
    valueBoolean?: boolean | null;
    sortOrder: number;
  }>;
};

export type CategoryPayload = {
  name: string;
  slug?: string;
  description?: string;
  parentId?: number | null;
  active: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
};

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

export function getAdminCategories(token: string) {
  return apiFetch<Category[]>("/admin/categories", { token });
}

export function createAdminCategory(token: string, data: CategoryPayload) {
  return apiFetch<Category>("/admin/categories", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateAdminCategory(token: string, id: number, data: CategoryPayload) {
  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteAdminCategory(token: string, id: number) {
  return apiFetch<void>(`/admin/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminProducts(token: string) {
  return apiFetch<Product[]>("/admin/products", { token });
}

export function getAdminProduct(token: string, id: number) {
  return apiFetch<Product>(`/admin/products/${id}`, { token });
}

export function createAdminProduct(token: string, data: ProductPayload) {
  return apiFetch<Product>("/admin/products", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateAdminProduct(token: string, id: number, data: ProductPayload) {
  return apiFetch<Product>(`/admin/products/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteAdminProduct(token: string, id: number) {
  return apiFetch<void>(`/admin/products/${id}`, {
    method: "DELETE",
    token,
  });
}
