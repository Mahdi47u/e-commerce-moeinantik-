"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { MapPin, ShieldCheck } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getCart } from "@/services/cartService";
import { checkout } from "@/services/orderService";
import type { Cart } from "@/types/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    setCustomerName([user?.firstName, user?.lastName].filter(Boolean).join(" "));
    setCustomerPhone(user?.phone || "");
    setCustomerEmail(user?.email || "");

    getCart(token)
      .then(setCart)
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت سبد خرید ناموفق بود."))
      .finally(() => setLoading(false));
  }, [authLoading, token, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setError("برای ثبت سفارش ابتدا وارد شوید.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const order = await checkout(token, {
        customerName,
        customerPhone,
        customerEmail,
        province,
        city,
        addressLine,
        postalCode,
        note,
      });
      router.push(`/orders?created=${order.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "ثبت سفارش ناموفق بود.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteShell>
      <section className="border-b border-border/70 bg-card">
        <div className="container py-10">
          <p className="text-sm font-medium text-primary">تکمیل خرید</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">اطلاعات ارسال سفارش</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            اطلاعات تماس و نشانی را وارد کنید تا سفارش ثبت شود. پرداخت در مرحله بعد از بخش سفارش ها انجام می شود.
          </p>
        </div>
      </section>

      <section className="container py-10">
        {loading && <CheckoutSkeleton />}

        {!loading && !token && (
          <Notice
            title="برای ادامه خرید وارد شوید"
            description="ثبت سفارش فقط برای کاربران وارد شده انجام می شود."
            href="/login"
            label="ورود"
          />
        )}

        {!loading && token && cart?.items.length === 0 && (
          <Notice
            title="سبد خرید خالی است"
            description="برای ثبت سفارش ابتدا محصولی را به سبد خرید اضافه کنید."
            href="/products"
            label="مشاهده محصولات"
          />
        )}

        {!loading && token && cart && cart.items.length > 0 && (
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="rounded-md border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">گیرنده و نشانی</h2>
                    <p className="mt-1 text-xs text-muted-foreground">فیلدهای ستاره دار برای ثبت سفارش ضروری هستند.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="نام و نام خانوادگی" value={customerName} onChange={setCustomerName} required />
                  <Field label="شماره تماس" value={customerPhone} onChange={setCustomerPhone} required />
                  <Field label="ایمیل" value={customerEmail} onChange={setCustomerEmail} type="email" />
                  <Field label="استان" value={province} onChange={setProvince} required />
                  <Field label="شهر" value={city} onChange={setCity} required />
                  <Field label="کد پستی" value={postalCode} onChange={setPostalCode} />
                  <div className="sm:col-span-2">
                    <Field label="آدرس کامل" value={addressLine} onChange={setAddressLine} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-foreground">توضیحات سفارش</label>
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="اگر نکته ای درباره ارسال یا هماهنگی دارید اینجا بنویسید."
                      className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </section>
            </div>

            <OrderSummary cart={cart} error={error} submitting={submitting} />
          </form>
        )}
      </section>
    </SiteShell>
  );
}

function OrderSummary({
  cart,
  error,
  submitting,
}: {
  cart: Cart;
  error: string;
  submitting: boolean;
}) {
  return (
    <aside className="h-fit rounded-md border border-border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-foreground">خلاصه سفارش</h2>
      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="تعداد کالا" value={formatNumber(cart.itemCount)} />
        <SummaryRow label="جمع سبد" value={formatPrice(cart.subtotal)} strong />
        <div className="flex items-start gap-2 rounded-md bg-background p-3 text-xs leading-6 text-muted-foreground">
          <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          هزینه ارسال و وضعیت پرداخت بعد از ثبت سفارش قابل پیگیری است.
        </div>
      </div>
      {error && <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting} className="mt-6 w-full">
        {submitting ? "در حال ثبت..." : "ثبت سفارش"}
      </Button>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="mr-1 text-primary">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function Notice({
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

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-t border-border pt-3 first:border-t-0 first:pt-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold text-primary" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="h-96 animate-pulse rounded-md bg-secondary" />
      <div className="h-56 animate-pulse rounded-md bg-secondary" />
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
