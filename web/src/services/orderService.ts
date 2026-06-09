import { apiFetch } from "@/lib/api";
import type { CheckoutRequest, Order } from "@/types/order";
import type { OrderStatus } from "@/types/order";

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

export function getAdminOrders(token: string) {
  return apiFetch<Order[]>("/admin/orders", { token });
}

export function getAdminOrder(token: string, id: number) {
  return apiFetch<Order>(`/admin/orders/${id}`, { token });
}

export function updateAdminOrderStatus(token: string, id: number, status: OrderStatus) {
  return apiFetch<Order>(`/admin/orders/${id}/status`, {
    method: "PUT",
    token,
    body: JSON.stringify({ status }),
  });
}
