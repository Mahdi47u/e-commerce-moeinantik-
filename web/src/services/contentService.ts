import { apiFetch } from "@/lib/api";
import type { ContentPage, Homepage } from "@/types/content";

export function getHomepage() {
  return apiFetch<Homepage>("/homepage");
}

export function getPage(slug: string) {
  return apiFetch<ContentPage>(`/pages/${encodeURIComponent(slug)}`);
}
