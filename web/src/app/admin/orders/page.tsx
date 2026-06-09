"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageCheck, Search } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getAdminOrder, getAdminOrders, updateAdminOrderStatus } from "@/services/orderService";
import type { Order, OrderStatus } from "@/types/order";
import type { Role } from "@/types/auth";

const ORDER_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const canManageOrders = hasAdminRole(user?.roles || []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || !canManageOrders) {
      setLoading(false);
      return;
    }

    getAdminOrders(token)
      .then((nextOrders) => {
        setOrders(nextOrders);
        setSelectedOrder(nextOrders[0] || null);
      })
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت سفارش‌ها ناموفق بود."))
      .finally(() => setLoading(false));
  }, [authLoading, token, canManageOrders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return orders;
    }

    return orders.filter((order) =>
      [order.orderNumber, order.customerName, order.customerPhone, order.city]
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [orders, query]);

  const metrics = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "PENDING_PAYMENT").length,
      processing: orders.filter((order) => order.status === "PROCESSING").length,
      revenue: orders.reduce((sum, order) => sum + order.total, 0),
    };
  }, [orders]);

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
      <section className="container py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">مدیریت سفارش‌ها</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">پیگیری عملیات فروش</h1>
          </div>
          <div className="flex h-11 min-w-72 items-center gap-3 rounded-md border border-border bg-card px-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو سفارش"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {!authLoading && !canManageOrders && (
          <div className="mt-8 rounded-md border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">دسترسی مدیریت لازم است</h2>
            <p className="mt-3 text-sm text-muted-foreground">این بخش فقط برای نقش‌های ADMIN و SUPERADMIN فعال است.</p>
          </div>
        )}

        {loading && canManageOrders && <div className="mt-8 h-48 animate-pulse rounded-md bg-secondary" />}

        {error && <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

        {!loading && canManageOrders && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="کل سفارش‌ها" value={formatNumber(metrics.total)} />
              <Metric label="در انتظار پرداخت" value={formatNumber(metrics.pending)} />
              <Metric label="در حال پردازش" value={formatNumber(metrics.processing)} />
              <Metric label="مبلغ سفارش‌ها" value={formatPrice(metrics.revenue)} />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div className="overflow-hidden rounded-md border border-border bg-card">
                <div className="grid grid-cols-[1fr_140px_120px] border-b border-border px-4 py-3 text-xs font-semibold text-muted-foreground">
                  <span>سفارش</span>
                  <span>وضعیت</span>
                  <span className="text-left">مبلغ</span>
                </div>
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">سفارشی پیدا نشد.</div>
                ) : (
                  filteredOrders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => selectOrder(order.id)}
                      className={
                        selectedOrder?.id === order.id
                          ? "grid w-full grid-cols-[1fr_140px_120px] gap-3 bg-secondary/70 px-4 py-4 text-right"
                          : "grid w-full grid-cols-[1fr_140px_120px] gap-3 border-t border-border px-4 py-4 text-right hover:bg-secondary/40"
                      }
                    >
                      <span>
                        <span className="block font-semibold text-foreground">{order.orderNumber}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{order.customerName}، {order.city}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">{statusLabel(order.status)}</span>
                      <span className="text-left text-sm font-semibold text-primary">{formatPrice(order.total)}</span>
                    </button>
                  ))
                )}
              </div>

              <aside className="h-fit rounded-md border border-border bg-card p-5">
                {selectedOrder ? (
                  <>
                    <div className="flex items-start gap-3">
                      <PackageCheck className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{selectedOrder.orderNumber}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{selectedOrder.customerName}، {selectedOrder.customerPhone}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm">
                      <Info label="پرداخت" value={paymentLabel(selectedOrder.paymentStatus)} />
                      <Info label="ارسال" value={`${selectedOrder.province}، ${selectedOrder.city}`} />
                      <Info label="آدرس" value={selectedOrder.addressLine} />
                    </div>

                    <div className="mt-5 border-t border-border pt-5">
                      <label className="mb-2 block text-sm font-medium text-foreground">وضعیت سفارش</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(event) => changeStatus(event.target.value as OrderStatus)}
                        disabled={updating}
                        className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{statusLabel(status)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-border pt-5">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between gap-4 text-sm">
                          <span className="text-foreground">{item.productName} × {formatNumber(item.quantity)}</span>
                          <span className="font-semibold text-primary">{formatPrice(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">یک سفارش را انتخاب کنید.</p>
                )}
              </aside>
            </div>
          </>
        )}
      </section>
    </SiteShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
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

function hasAdminRole(roles: Role[]) {
  return roles.includes("ADMIN") || roles.includes("SUPERADMIN");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
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

function paymentLabel(status: Order["paymentStatus"]) {
  const labels: Record<Order["paymentStatus"], string> = {
    PENDING: "در انتظار پرداخت",
    PAID: "پرداخت شده",
    FAILED: "ناموفق",
    REFUNDED: "بازگشت وجه",
  };

  return labels[status];
}
