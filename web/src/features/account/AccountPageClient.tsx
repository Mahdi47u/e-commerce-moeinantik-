"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  Heart,
  Home,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getOrders } from "@/services/orderService";
import type { User } from "@/types/auth";
import type { Order } from "@/types/order";

type AccountTab = "orders" | "favorites" | "profile" | "password" | "addresses";

const accountNav: Array<{ id: AccountTab | "signout"; label: string; icon: LucideIcon }> = [
  { id: "orders", label: "سفارش‌ها", icon: Package },
  { id: "favorites", label: "علاقه‌مندی‌ها", icon: Heart },
  { id: "profile", label: "اطلاعات شخصی", icon: UserRound },
  { id: "password", label: "تغییر رمز عبور", icon: ShieldCheck },
  { id: "addresses", label: "آدرس‌ها", icon: Home },
  { id: "signout", label: "خروج از حساب", icon: LogOut },
];

export default function AccountPage() {
  const { user, token, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [activeTab, setActiveTab] = useState<AccountTab>("orders");

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    setOrdersError("");
    getOrders(token)
      .then(setOrders)
      .catch((error) =>
        setOrdersError(error instanceof Error ? error.message : "دریافت سفارش‌ها ناموفق بود.")
      )
      .finally(() => setOrdersLoading(false));
  }, [authLoading, token]);

  const displayName = useMemo(() => {
    if (!user) return "";
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    return fullName || user.username;
  }, [user]);

  if (authLoading) {
    return (
      <SiteShell contentClassName="container py-12">
        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="h-80 animate-pulse rounded-md bg-secondary" />
          <div className="h-96 animate-pulse rounded-md bg-secondary" />
        </div>
      </SiteShell>
    );
  }

  if (!user) {
    return (
      <SiteShell contentClassName="container flex items-center justify-center py-12">
        <div className="max-w-md rounded-md border border-border bg-card p-6 text-center shadow-soft">
          <UserRound className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-semibold text-foreground">ابتدا وارد شوید</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            برای مشاهده حساب کاربری و سفارش‌ها باید وارد حساب خود شوید.
          </p>
          <Button asChild className="mt-5">
            <Link href="/login">ورود</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  function handleNav(id: AccountTab | "signout") {
    if (id === "signout") {
      logout();
      return;
    }
    setActiveTab(id);
  }

  return (
    <SiteShell contentClassName="container py-8 lg:py-12">
      <div className="mb-5">
        <p className="text-sm font-semibold text-primary">حساب کاربری</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">پروفایل من</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-md border border-border bg-card p-4 shadow-soft">
          <div className="border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">خوش آمدید</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{displayName}</p>
            <p className="mt-1 break-all text-xs text-muted-foreground">{user.email}</p>
          </div>

          <nav className="mt-3 divide-y divide-border" aria-label="ناوبری حساب کاربری">
            {accountNav.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeTab;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={
                    active
                      ? "flex min-h-14 w-full items-center justify-between gap-3 rounded-md bg-secondary px-3 text-sm font-semibold text-foreground"
                      : "flex min-h-14 w-full items-center justify-between gap-3 px-3 text-sm font-semibold text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </span>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="rounded-md border border-border bg-card p-4 shadow-soft sm:p-6">
          {activeTab === "orders" && (
            <OrdersPanel orders={orders} loading={ordersLoading} error={ordersError} />
          )}
          {activeTab === "favorites" && (
            <ActionPanel
              icon={Heart}
              title="علاقه‌مندی‌ها"
              description="محصولاتی که ذخیره کرده‌اید در این بخش نمایش داده می‌شوند."
              actionHref="/wishlist"
              actionLabel="مشاهده علاقه‌مندی‌ها"
            />
          )}
          {activeTab === "profile" && <ProfilePanel user={user} />}
          {activeTab === "password" && (
            <ActionPanel
              icon={ShieldCheck}
              title="تغییر رمز عبور"
              description="در نسخه بعدی امکان تغییر رمز عبور از داخل حساب اضافه می‌شود."
              actionHref="/login"
              actionLabel="ورود دوباره"
            />
          )}
          {activeTab === "addresses" && <AddressesPanel orders={orders} />}
        </main>
      </div>
    </SiteShell>
  );
}

function OrdersPanel({ orders, loading, error }: { orders: Order[]; loading: boolean; error: string }) {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">سفارش‌ها</h2>
          <p className="mt-1 text-sm text-muted-foreground">آخرین خریدها و وضعیت ارسال شما</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/orders">همه سفارش‌ها</Link>
        </Button>
      </div>

      {loading && (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-md bg-secondary" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-6 rounded-md border border-border bg-background p-8 text-center">
          <ShoppingBag className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">هنوز سفارشی ثبت نشده است</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
            بعد از خرید، سفارش‌های شما اینجا با وضعیت پرداخت و ارسال نمایش داده می‌شوند.
          </p>
          <Button asChild className="mt-5">
            <Link href="/products">مشاهده محصولات</Link>
          </Button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.slice(0, 4).map((order) => (
            <OrderSummaryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}

function OrderSummaryCard({ order }: { order: Order }) {
  const visibleItems = order.items.slice(0, 3);

  return (
    <article className="rounded-md border border-border bg-background p-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(180px,240px)_minmax(0,1fr)_130px] xl:items-center">
        <div className="flex min-w-0 items-center gap-3">
          {visibleItems.length === 0 && <div className="h-16 w-16 rounded-md bg-secondary" />}
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary"
            >
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.productName} fill sizes="64px" className="object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">تصویر</div>
              )}
            </div>
          ))}
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-4">
          <InfoCell label="شماره سفارش" value={order.orderNumber} />
          <InfoCell label="تاریخ" value={formatDate(order.createdAt)} />
          <InfoCell label="مبلغ" value={formatPrice(order.total)} />
          <InfoCell label="وضعیت" value={statusLabel(order.status)} tone={statusTone(order.status)} />
        </dl>

        <div className="flex flex-wrap justify-end gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href="/orders">مشاهده سفارش</Link>
          </Button>
          {order.status === "SHIPPED" && (
            <Button asChild size="sm">
              <Link href="/orders">پیگیری</Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProfilePanel({ user }: { user: User }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">اطلاعات شخصی</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ProfileInfo icon={<UserRound className="h-4 w-4" />} label="نام کاربری" value={user.username} />
        <ProfileInfo icon={<Mail className="h-4 w-4" />} label="ایمیل" value={user.email} />
        <ProfileInfo icon={<Phone className="h-4 w-4" />} label="شماره تماس" value={user.phone || "ثبت نشده"} />
        <ProfileInfo icon={<ShieldCheck className="h-4 w-4" />} label="نقش‌ها" value={roleLabels(user.roles)} />
      </div>
    </section>
  );
}

function AddressesPanel({ orders }: { orders: Order[] }) {
  const latestOrder = orders[0];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">آدرس‌ها</h2>
      {latestOrder ? (
        <div className="mt-6 rounded-md border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">{latestOrder.customerName}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {latestOrder.province}، {latestOrder.city}، {latestOrder.addressLine}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{latestOrder.customerPhone}</p>
            </div>
          </div>
        </div>
      ) : (
        <ActionPanel
          icon={MapPin}
          title="آدرسی ثبت نشده است"
          description="بعد از اولین سفارش، آدرس ارسال شما اینجا نمایش داده می‌شود."
          actionHref="/checkout"
          actionLabel="ثبت سفارش"
        />
      )}
    </section>
  );
}

function ActionPanel({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="rounded-md border border-border bg-background p-8 text-center">
      <Icon className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
      <Button asChild className="mt-5">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </section>
  );
}

function InfoCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-700"
      : tone === "warning"
        ? "text-amber-700"
        : tone === "danger"
          ? "text-destructive"
          : "text-foreground";

  return (
    <div>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm font-semibold moein-tabular ${toneClass}`}>{value}</dd>
    </div>
  );
}

function ProfileInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 break-words font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function statusLabel(status: Order["status"]) {
  const labels: Record<Order["status"], string> = {
    PENDING_PAYMENT: "در انتظار پرداخت",
    PROCESSING: "در حال پردازش",
    SHIPPED: "ارسال شده",
    COMPLETED: "تحویل شده",
    CANCELLED: "لغو شده",
  };

  return labels[status];
}

function statusTone(status: Order["status"]) {
  if (status === "COMPLETED" || status === "SHIPPED") return "success";
  if (status === "PROCESSING" || status === "PENDING_PAYMENT") return "warning";
  if (status === "CANCELLED") return "danger";
  return "neutral";
}

function roleLabels(roles: string[]) {
  const labels: Record<string, string> = {
    USER: "کاربر",
    ADMIN: "مدیر",
    SUPERADMIN: "مدیر کل",
  };

  return roles.map((role) => labels[role] || role).join("، ");
}
