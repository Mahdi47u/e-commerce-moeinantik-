"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, PackageCheck, RefreshCw, Search, Truck } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getAdminOrder, getAdminOrders, updateAdminOrderStatus } from "@/services/orderService";
import type { Role } from "@/types/auth";
import type { Order, OrderStatus } from "@/types/order";

const ORDER_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const canManageOrders = hasAdminRole(user?.roles || []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || !canManageOrders) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [authLoading, token, canManageOrders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return orders;
    }

    return orders.filter((order) =>
      [order.orderNumber, order.customerName, order.customerPhone, order.city, order.province]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [orders, query]);

  const metrics = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "PENDING_PAYMENT").length,
      processing: orders.filter((order) => order.status === "PROCESSING").length,
      shipped: orders.filter((order) => order.status === "SHIPPED").length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
    };
  }, [orders]);

  async function loadOrders() {
    if (!token) {
      return;
    }

    setError("");
    setRefreshing(true);
    try {
      const nextOrders = await getAdminOrders(token);
      setOrders(nextOrders);
      setSelectedOrder((current) => {
        if (!current) {
          return nextOrders[0] || null;
        }
        return nextOrders.find((order) => order.id === current.id) || nextOrders[0] || null;
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت سفارش‌ها ناموفق بود.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function selectOrder(orderId: number) {
    if (!token) {
      return;
    }

    setError("");
    try {
      setSelectedOrder(await getAdminOrder(token, orderId));
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت سفارش ناموفق بود.");
    }
  }

  async function changeStatus(status: OrderStatus) {
    if (!token || !selectedOrder) {
      return;
    }

    setUpdating(true);
    setError("");
    try {
      const updated = await updateAdminOrderStatus(token, selectedOrder.id, status);
      setSelectedOrder(updated);
      setOrders((current) => current.map((order) => (order.id === updated.id ? updated : order)));
    } catch (error) {
      setError(error instanceof Error ? error.message : "به‌روزرسانی وضعیت ناموفق بود.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <SiteShell>
      <AdminShell
        title="مدیریت سفارش‌ها"
        description="سفارش‌های ثبت‌شده را جستجو کنید، وضعیت ارسال را تغییر دهید و جزئیات پرداخت و آدرس را سریع بررسی کنید."
        actions={
          <Button type="button" variant="secondary" onClick={loadOrders} disabled={refreshing || loading || !canManageOrders}>
            <RefreshCw className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
            به‌روزرسانی
          </Button>
        }
      >
        {!authLoading && !canManageOrders && <AccessDenied />}

        {loading && canManageOrders && <AdminOrdersSkeleton />}

        {error && (
          <p className="mb-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {!loading && canManageOrders && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="کل سفارش‌ها" value={formatNumber(metrics.total)} icon={<PackageCheck className="h-4 w-4" />} />
              <Metric label="در انتظار پرداخت" value={formatNumber(metrics.pending)} icon={<AlertCircle className="h-4 w-4" />} />
              <Metric label="در حال پردازش" value={formatNumber(metrics.processing)} icon={<RefreshCw className="h-4 w-4" />} />
              <Metric label="ارسال شده" value={formatNumber(metrics.shipped)} icon={<Truck className="h-4 w-4" />} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">فهرست سفارش‌ها</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatNumber(filteredOrders.length)} سفارش از {formatNumber(orders.length)} سفارش نمایش داده می‌شود.
                </p>
              </div>
              <label className="flex h-11 min-w-64 items-center gap-3 rounded-md border border-border bg-background px-3">
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">جستجو سفارش</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="شماره، نام، شهر یا تلفن"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <OrdersList orders={filteredOrders} selectedOrderId={selectedOrder?.id} onSelect={selectOrder} />
              <OrderDetails order={selectedOrder} updating={updating} onChangeStatus={changeStatus} />
            </div>

            <div className="rounded-md border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">مجموع مبلغ سفارش‌های فعلی</span>
                <span className="text-lg font-semibold text-primary">{formatPrice(metrics.revenue)}</span>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </SiteShell>
  );
}

function OrdersList({
  orders,
  selectedOrderId,
  onSelect,
}: {
  orders: Order[];
  selectedOrderId?: number;
  onSelect: (orderId: number) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">سفارشی پیدا نشد</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
          عبارت جستجو را کوتاه‌تر کنید یا بعد از ثبت سفارش جدید دوباره این بخش را بررسی کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <div className="hidden grid-cols-[1fr_150px_130px] border-b border-border px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
        <span>سفارش</span>
        <span>وضعیت</span>
        <span className="text-left">مبلغ</span>
      </div>
      {orders.map((order) => (
        <button
          key={order.id}
          type="button"
          onClick={() => onSelect(order.id)}
          className={
            selectedOrderId === order.id
              ? "grid w-full gap-3 bg-secondary/70 px-4 py-4 text-right md:grid-cols-[1fr_150px_130px]"
              : "grid w-full gap-3 border-t border-border px-4 py-4 text-right transition first:border-t-0 hover:bg-secondary/40 md:grid-cols-[1fr_150px_130px]"
          }
        >
          <span>
            <span className="block font-semibold text-foreground">{order.orderNumber}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {order.customerName}، {order.city}، {formatDate(order.createdAt)}
            </span>
          </span>
          <span>
            <StatusPill label={statusLabel(order.status)} tone={statusTone(order.status)} />
          </span>
          <span className="text-left text-sm font-semibold text-primary">{formatPrice(order.total)}</span>
        </button>
      ))}
    </div>
  );
}

function OrderDetails({
  order,
  updating,
  onChangeStatus,
}: {
  order: Order | null;
  updating: boolean;
  onChangeStatus: (status: OrderStatus) => void;
}) {
  if (!order) {
    return (
      <aside className="h-fit rounded-md border border-border bg-card p-6 text-center xl:sticky xl:top-24">
        <PackageCheck className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">یک سفارش را انتخاب کنید</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">جزئیات پرداخت، آدرس و اقلام سفارش اینجا نمایش داده می‌شود.</p>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-md border border-border bg-card p-5 xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <PackageCheck className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">{order.orderNumber}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.customerName}، {order.customerPhone}
            </p>
          </div>
        </div>
        <StatusPill label={paymentLabel(order.paymentStatus)} tone={order.paymentStatus === "PAID" ? "success" : "neutral"} />
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <Info label="تاریخ ثبت" value={formatDate(order.createdAt)} />
        <Info label="ارسال" value={`${order.province}، ${order.city}`} />
        <Info label="آدرس" value={order.addressLine} />
        {order.postalCode && <Info label="کد پستی" value={order.postalCode} />}
        {order.customerEmail && <Info label="ایمیل" value={order.customerEmail} />}
        {order.note && <Info label="یادداشت" value={order.note} />}
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <label className="mb-2 block text-sm font-medium text-foreground">وضعیت سفارش</label>
        <select
          value={order.status}
          onChange={(event) => onChangeStatus(event.target.value as OrderStatus)}
          disabled={updating}
          className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>
        {updating && <p className="mt-2 text-xs text-muted-foreground">در حال ذخیره وضعیت...</p>}
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-5">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm">
            <span className="text-foreground">
              {item.productName} × {formatNumber(item.quantity)}
            </span>
            <span className="shrink-0 font-semibold text-primary">{formatPrice(item.lineTotal)}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
        <SummaryRow label="جمع کالاها" value={formatPrice(order.subtotal)} />
        <SummaryRow label="ارسال" value={formatPrice(order.shippingCost)} />
        <SummaryRow label="مبلغ کل" value={formatPrice(order.total)} strong />
      </div>
    </aside>
  );
}

function AccessDenied() {
  return (
    <div className="rounded-md border border-border bg-card p-8 text-center">
      <AlertCircle className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-foreground">دسترسی مدیریت لازم است</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
        این بخش فقط برای نقش‌های ADMIN و SUPERADMIN فعال است. با حساب مدیریتی وارد شوید.
      </p>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-3 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 leading-6 text-foreground">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold text-primary" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "success" | "warning" | "neutral" | "danger" }) {
  const className = {
    success: "border-primary/20 bg-primary/10 text-primary",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    neutral: "border-border bg-background text-muted-foreground",
    danger: "border-destructive/20 bg-destructive/10 text-destructive",
  }[tone];

  return <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

function AdminOrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-md bg-secondary" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="h-80 animate-pulse rounded-md bg-secondary" />
        <div className="h-80 animate-pulse rounded-md bg-secondary" />
      </div>
    </div>
  );
}

function hasAdminRole(roles: Role[]) {
  return roles.includes("ADMIN") || roles.includes("SUPERADMIN");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fa-IR");
}

function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING_PAYMENT: "در انتظار پرداخت",
    PROCESSING: "در حال پردازش",
    SHIPPED: "ارسال شده",
    COMPLETED: "تکمیل شده",
    CANCELLED: "لغو شده",
  };

  return labels[status];
}

function statusTone(status: OrderStatus) {
  const tones: Record<OrderStatus, "success" | "warning" | "neutral" | "danger"> = {
    PENDING_PAYMENT: "warning",
    PROCESSING: "neutral",
    SHIPPED: "success",
    COMPLETED: "success",
    CANCELLED: "danger",
  };

  return tones[status];
}

function paymentLabel(status: Order["paymentStatus"]) {
  const labels: Record<Order["paymentStatus"], string> = {
    PENDING: "در انتظار پرداخت",
    PAID: "پرداخت شده",
    FAILED: "ناموفق",
    REFUNDED: "بازگشت وجه",
  };

  return labels[status];
}
