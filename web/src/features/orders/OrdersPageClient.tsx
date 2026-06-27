"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard } from "lucide-react";
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
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت سفارش ها ناموفق بود."))
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
      <section className="border-b border-border/70 bg-card">
        <div className="container py-10">
          <p className="text-sm font-medium text-primary">سفارش ها</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">پیگیری خریدهای شما</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            وضعیت سفارش، پرداخت و اقلام خریداری شده را از این بخش دنبال کنید.
          </p>
        </div>
      </section>

      <section className="container py-10">
        {loading && <OrdersSkeleton />}

        {!loading && !token && (
          <Empty
            title="برای مشاهده سفارش ها وارد شوید"
            description="سفارش ها به حساب کاربری شما متصل هستند."
            href="/login"
            label="ورود"
          />
        )}

        {!loading && token && orders.length === 0 && (
          <Empty
            title="هنوز سفارشی ثبت نشده است"
            description="بعد از ثبت اولین سفارش، وضعیت آن در این صفحه نمایش داده می شود."
            href="/products"
            label="مشاهده محصولات"
          />
        )}

        {error && (
          <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                paying={payingOrderId === order.id}
                onPay={() => pay(order.id)}
              />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function OrderCard({ order, paying, onPay }: { order: Order; paying: boolean; onPay: () => void }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{order.orderNumber}</h2>
            <StatusBadge label={statusLabel(order.status)} />
            <StatusBadge label={paymentLabel(order.paymentStatus)} muted={order.paymentStatus !== "PAID"} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("fa-IR")}، ارسال به {order.city}
          </p>
        </div>
        <div className="text-left">
          <p className="text-sm text-muted-foreground">مبلغ سفارش</p>
          <p className="mt-1 text-lg font-semibold text-primary">{formatPrice(order.total)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex -space-x-3 space-x-reverse">
            {order.items.slice(0, 4).map((item) => (
              <div key={item.id} className="relative h-12 w-12 overflow-hidden rounded-md border border-card bg-secondary">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.productName} fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(var(--card)))]" />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatNumber(itemCount)} کالا، {order.items[0]?.productName || "سفارش فروشگاه"}
            {order.items.length > 1 ? ` و ${formatNumber(order.items.length - 1)} مورد دیگر` : ""}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {order.paymentStatus === "PENDING" && (
            <Button type="button" disabled={paying} onClick={onPay}>
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              {paying ? "در حال اتصال..." : "پرداخت آنلاین"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span
      className={
        muted
          ? "rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground"
          : "rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground"
      }
    >
      {label}
    </span>
  );
}

function Empty({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
      <Button asChild className="mt-6">
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-md bg-secondary" />
      ))}
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

function paymentLabel(status: Order["paymentStatus"]) {
  const labels: Record<Order["paymentStatus"], string> = {
    PENDING: "پرداخت نشده",
    PAID: "پرداخت شده",
    FAILED: "پرداخت ناموفق",
    REFUNDED: "بازگشت وجه",
  };

  return labels[status];
}
