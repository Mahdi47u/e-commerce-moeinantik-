import { apiFetch } from "@/lib/api";
import type { CheckoutRequest, Order } from "@/types/order";

export function checkout(token: string, data: CheckoutRequest) {
  return apiFetch<Order>("/checkout", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function getOrders(token: string) {
  return apiFetch<Order[]>("/orders", { token });
}

export function getOrder(token: string, id: number) {
  return apiFetch<Order>(`/orders/${id}`, { token });
}
