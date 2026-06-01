import { apiFetch } from "@/lib/api";

export type StartPaymentResponse = {
  orderId: number;
  authority: string;
  paymentUrl: string;
};

export function startZarinPalPayment(token: string, orderId: number) {
  return apiFetch<StartPaymentResponse>(`/payments/zarinpal/orders/${orderId}/start`, {
    method: "POST",
    token,
  });
}
