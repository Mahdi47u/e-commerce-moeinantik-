"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
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
      <section className="container py-10">
        <p className="text-sm font-medium text-primary">تکمیل خرید</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">اطلاعات ارسال سفارش</h1>

        {loading && <div className="mt-8 h-40 animate-pulse rounded-md bg-secondary" />}

        {!loading && !token && (
          <Notice title="برای ادامه خرید وارد شوید" href="/login" label="ورود" />
        )}

        {!loading && token && cart?.items.length === 0 && (
          <Notice title="سبد خرید خالی است" href="/products" label="مشاهده محصولات" />
        )}

        {!loading && token && cart && cart.items.length > 0 && (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-4 rounded-md border border-border bg-card p-5 sm:grid-cols-2">
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
                <label className="mb-2 block text-sm font-medium text-foreground">توضیحات</label>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="min-h-28 w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <aside className="h-fit rounded-md border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">خلاصه سفارش</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تعداد کالا</span>
                  <span className="font-medium text-foreground">{formatNumber(cart.itemCount)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">مبلغ قابل پرداخت</span>
                  <span className="font-semibold text-primary">{formatPrice(cart.subtotal)}</span>
                </div>
              </div>
              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={submitting} className="mt-6 w-full">
                {submitting ? "در حال ثبت..." : "ثبت سفارش"}
              </Button>
            </aside>
          </form>
        )}
      </section>
    </SiteShell>
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
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function Notice({ title, href, label }: { title: string; href: string; label: string }) {
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
