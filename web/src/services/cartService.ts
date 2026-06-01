import { apiFetch } from "@/lib/api";
import type { Cart } from "@/types/cart";

export function getCart(token: string) {
  return apiFetch<Cart>("/cart", { token });
}

export function addCartItem(token: string, productVariantId: number, quantity = 1) {
  return apiFetch<Cart>("/cart/items", {
    method: "POST",
    token,
    body: JSON.stringify({ productVariantId, quantity }),
  });
}

export function updateCartItem(token: string, itemId: number, quantity: number) {
  return apiFetch<Cart>(`/cart/items/${itemId}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(token: string, itemId: number) {
  return apiFetch<Cart>(`/cart/items/${itemId}`, {
    method: "DELETE",
    token,
  });
}

export function clearCart(token: string) {
  return apiFetch<Cart>("/cart", {
    method: "DELETE",
    token,
  });
}
