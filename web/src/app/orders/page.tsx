"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getOrders } from "@/services/orderService";
import { startZarinPalPayment } from "@/services/paymentService";
import type { Order } from "@/types/order";

export default function OrdersPage() {
  const { token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    getOrders(token)
      .then(setOrders)
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت سفارش‌ها ناموفق بود."))
      .finally(() => setLoading(false));
  }, [authLoading, token]);

  async function pay(orderId: number) {
    if (!token) {
      return;
    }

    setPayingOrderId(orderId);
    setError("");
    try {
      const response = await startZarinPalPayment(token, orderId);
      window.location.href = response.paymentUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : "شروع پرداخت ناموفق بود.");
      setPayingOrderId(null);
    }
  }

  return (
    <SiteShell>
      <section className="container py-10">
        <p className="text-sm font-medium text-primary">سفارش‌ها</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">پیگیری خریدهای شما</h1>

        {loading && <div className="mt-8 h-40 animate-pulse rounded-md bg-secondary" />}

        {!loading && !token && (
          <Empty title="برای مشاهده سفارش‌ها وارد شوید" href="/login" label="ورود" />
        )}

        {!loading && token && orders.length === 0 && (
          <Empty title="هنوز سفارشی ثبت نشده است" href="/products" label="مشاهده محصولات" />
        )}

        {error && <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

        {!loading && orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-md border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{order.orderNumber}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-primary">{formatPrice(order.total)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{statusLabel(order.status)}</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                  {formatNumber(order.items.reduce((sum, item) => sum + item.quantity, 0))} کالا، ارسال به {order.city}
                </div>
                {order.paymentStatus === "PENDING" && (
                  <Button
                    type="button"
                    className="mt-4"
                    disabled={payingOrderId === order.id}
                    onClick={() => pay(order.id)}
                  >
                    {payingOrderId === order.id ? "در حال اتصال..." : "پرداخت آنلاین"}
                  </Button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function Empty({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="mt-8 rounded-md border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <Button asChild className="mt-6">
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function statusLabel(status: Order["status"]) {
  const labels: Record<Order["status"], string> = {
    PENDING_PAYMENT: "در انتظار پرداخت",
    PROCESSING: "در حال پردازش",
    SHIPPED: "ارسال شده",
    COMPLETED: "تکمیل شده",
    CANCELLED: "لغو شده",
  };

  return labels[status];
}
