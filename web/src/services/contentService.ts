import { apiFetch } from "@/lib/api";
import type { ContentPage, Homepage } from "@/types/content";

export type ContentPagePayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export function getHomepage() {
  return apiFetch<Homepage>("/homepage");
}

export function getPage(slug: string) {
  return apiFetch<ContentPage>(`/pages/${encodeURIComponent(slug)}`);
}

export function getAdminPages(token: string) {
  return apiFetch<ContentPage[]>("/admin/pages", { token });
}

export function createAdminPage(token: string, data: ContentPagePayload) {
  return apiFetch<ContentPage>("/admin/pages", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateAdminPage(token: string, id: number, data: ContentPagePayload) {
  return apiFetch<ContentPage>(`/admin/pages/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteAdminPage(token: string, id: number) {
  return apiFetch<void>(`/admin/pages/${id}`, {
    method: "DELETE",
    token,
  });
}
