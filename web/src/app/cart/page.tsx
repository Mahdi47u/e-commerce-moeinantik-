"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getCart, removeCartItem, updateCartItem } from "@/services/cartService";
import type { Cart } from "@/types/cart";

export default function CartPage() {
  const { token, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItemId, setBusyItemId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getCart(token)
      .then(setCart)
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت سبد خرید ناموفق بود."))
      .finally(() => setLoading(false));
  }, [authLoading, token]);

  async function changeQuantity(itemId: number, quantity: number) {
    if (!token || quantity < 1) {
      return;
    }

    setBusyItemId(itemId);
    setError("");
    try {
      setCart(await updateCartItem(token, itemId, quantity));
    } catch (error) {
      setError(error instanceof Error ? error.message : "به‌روزرسانی سبد خرید ناموفق بود.");
    } finally {
      setBusyItemId(null);
    }
  }

  async function removeItem(itemId: number) {
    if (!token) {
      return;
    }

    setBusyItemId(itemId);
    setError("");
    try {
      setCart(await removeCartItem(token, itemId));
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف محصول ناموفق بود.");
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <SiteShell>
      <section className="container py-10">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-6 w-6 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-primary">سبد خرید</p>
            <h1 className="mt-1 text-3xl font-semibold text-foreground">محصولات انتخاب‌شده</h1>
          </div>
        </div>

        {loading && <div className="mt-8 h-40 animate-pulse rounded-md bg-secondary" />}

        {!loading && !token && (
          <EmptyState
            title="برای دیدن سبد خرید وارد شوید"
            description="سبد خرید به حساب کاربری شما متصل است تا بین دستگاه‌ها حفظ شود."
            actionHref="/login"
            actionLabel="ورود"
          />
        )}

        {!loading && token && cart && cart.items.length === 0 && (
          <EmptyState
            title="سبد خرید خالی است"
            description="محصولات گالری را ببینید و قطعات مورد علاقه خود را اضافه کنید."
            actionHref="/products"
            actionLabel="مشاهده محصولات"
          />
        )}

        {error && (
          <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && token && cart && cart.items.length > 0 && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <article key={item.id} className="grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-[112px_minmax(0,1fr)]">
                  <Link href={`/products/${item.productSlug}`} className="relative aspect-square overflow-hidden rounded-md bg-secondary">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.productName} fill sizes="112px" className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(var(--card)))]" />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Link href={`/products/${item.productSlug}`} className="font-semibold leading-7 text-foreground hover:text-primary">
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">{item.variantTitle}</p>
                      <p className="mt-3 text-sm font-semibold text-primary">{formatPrice(item.unitPrice)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 items-center rounded-md border border-border bg-background">
                        <button
                          type="button"
                          className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40"
                          disabled={busyItemId === item.id || item.quantity <= 1}
                          onClick={() => changeQuantity(item.id, item.quantity - 1)}
                          aria-label="کم کردن تعداد"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40"
                          disabled={busyItemId === item.id}
                          onClick={() => changeQuantity(item.id, item.quantity + 1)}
                          aria-label="زیاد کردن تعداد"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted-foreground hover:bg-secondary/50 hover:text-destructive disabled:opacity-40"
                        disabled={busyItemId === item.id}
                        onClick={() => removeItem(item.id)}
                        aria-label="حذف از سبد"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-md border border-border bg-card p-5">
              <h2 className="text-lg font-semibold text-foreground">خلاصه سفارش</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تعداد کالا</span>
                  <span className="font-medium text-foreground">{new Intl.NumberFormat("fa-IR").format(cart.itemCount)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">جمع سبد</span>
                  <span className="font-semibold text-primary">{formatPrice(cart.subtotal)}</span>
                </div>
              </div>
              <Button asChild className="mt-6 w-full">
                <Link href="/checkout">ادامه ثبت سفارش</Link>
              </Button>
            </aside>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="mt-8 rounded-md border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
      <Button asChild className="mt-6">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}
