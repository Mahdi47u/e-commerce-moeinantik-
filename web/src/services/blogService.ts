import { apiFetch } from "@/lib/api";
import type { BlogCategory, BlogCategoryPayload, BlogPost, BlogPostPayload } from "@/types/blog";

export function getBlogCategories() {
  return apiFetch<BlogCategory[]>("/blog/categories");
}

export function getBlogPosts(params: { category?: string; query?: string; page?: number; size?: number } = {}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.query) search.set("query", params.query);
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));

  const query = search.toString();
  return apiFetch<BlogPost[]>(`/blog/posts${query ? `?${query}` : ""}`);
}

export function getBlogPost(slug: string) {
  return apiFetch<BlogPost>(`/blog/posts/${encodeURIComponent(slug)}`);
}

export function getAdminBlogCategories(token: string) {
  return apiFetch<BlogCategory[]>("/admin/blog/categories", { token });
}

export function createAdminBlogCategory(token: string, data: BlogCategoryPayload) {
  return apiFetch<BlogCategory>("/admin/blog/categories", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateAdminBlogCategory(token: string, id: number, data: BlogCategoryPayload) {
  return apiFetch<BlogCategory>(`/admin/blog/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteAdminBlogCategory(token: string, id: number) {
  return apiFetch<void>(`/admin/blog/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminBlogPosts(token: string) {
  return apiFetch<BlogPost[]>("/admin/blog/posts", { token });
}

export function createAdminBlogPost(token: string, data: BlogPostPayload) {
  return apiFetch<BlogPost>("/admin/blog/posts", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateAdminBlogPost(token: string, id: number, data: BlogPostPayload) {
  return apiFetch<BlogPost>(`/admin/blog/posts/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteAdminBlogPost(token: string, id: number) {
  return apiFetch<void>(`/admin/blog/posts/${id}`, {
    method: "DELETE",
    token,
  });
}
