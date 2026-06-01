export type OrderStatus = "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type CheckoutRequest = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode?: string;
  note?: string;
};

export type OrderItem = {
  id: number;
  productId?: number | null;
  productVariantId?: number | null;
  productName: string;
  productSlug: string;
  variantTitle: string;
  sku?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string | null;
};

export type Order = {
  id: number;
  createdAt: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  province: string;
  city: string;
  addressLine: string;
  postalCode?: string | null;
  note?: string | null;
  items: OrderItem[];
};
