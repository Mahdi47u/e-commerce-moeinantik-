import { apiFetch } from "@/lib/api";
import type { WishlistItem } from "@/types/wishlist";

export function getWishlist(token: string) {
  return apiFetch<WishlistItem[]>("/wishlist", { token });
}

export function addWishlistItem(token: string, productId: number) {
  return apiFetch<WishlistItem>("/wishlist", {
    method: "POST",
    token,
    body: JSON.stringify({ productId }),
  });
}

export function removeWishlistItem(token: string, productId: number) {
  return apiFetch<void>(`/wishlist/${productId}`, {
    method: "DELETE",
    token,
  });
}
