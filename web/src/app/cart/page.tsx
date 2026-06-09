"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getCart, removeCartItem, updateCartItem } from "@/services/cartService";
import type { Cart, CartItem } from "@/types/cart";

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
      setError(error instanceof Error ? error.message : "به روز رسانی سبد خرید ناموفق بود.");
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

  const hasItems = Boolean(token && cart && cart.items.length > 0);

  return (
    <SiteShell>
      <section className="border-b border-border/70 bg-card">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-10">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md border border-border bg-background text-primary">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-primary">سبد خرید</p>
              <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">محصولات انتخاب شده</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                تعداد محصولات را بررسی کنید و برای ثبت سفارش وارد مرحله checkout شوید.
              </p>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link href="/products">ادامه خرید</Link>
          </Button>
        </div>
      </section>

      <section className="container py-10">
        {loading && <CartSkeleton />}

        {!loading && !token && (
          <EmptyState
            title="برای دیدن سبد خرید وارد شوید"
            description="سبد خرید به حساب کاربری شما متصل است تا بین دستگاه ها حفظ شود."
            actionHref="/login"
            actionLabel="ورود"
          />
        )}

        {!loading && token && cart && cart.items.length === 0 && (
          <EmptyState
            title="سبد خرید خالی است"
            description="محصولات گالری را ببینید و قطعات مورد علاقه خود را به سبد خرید اضافه کنید."
            actionHref="/products"
            actionLabel="مشاهده محصولات"
          />
        )}

        {error && (
          <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {hasItems && cart && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  busy={busyItemId === item.id}
                  onDecrease={() => changeQuantity(item.id, item.quantity - 1)}
                  onIncrease={() => changeQuantity(item.id, item.quantity + 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            <OrderSummary cart={cart} />
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function CartItemRow({
  item,
  busy,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  busy: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-[128px_minmax(0,1fr)]">
      <Link href={`/products/${item.productSlug}`} className="relative aspect-square overflow-hidden rounded-md bg-secondary">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.productName} fill sizes="128px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(var(--card)))]" />
        )}
      </Link>

      <div className="flex min-w-0 flex-col justify-between gap-5">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href={`/products/${item.productSlug}`} className="font-semibold leading-7 text-foreground hover:text-primary">
              {item.productName}
            </Link>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {item.variantTitle && <span className="rounded-md bg-background px-2 py-1">{item.variantTitle}</span>}
              {item.sku && <span className="rounded-md bg-background px-2 py-1">کد کالا: {item.sku}</span>}
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-primary">{formatPrice(item.lineTotal)}</p>
            <p className="mt-1 text-xs text-muted-foreground">قیمت واحد: {formatPrice(item.unitPrice)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex h-10 items-center rounded-md border border-border bg-background">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40"
              disabled={busy || item.quantity <= 1}
              onClick={onDecrease}
              aria-label="کم کردن تعداد"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-10 text-center text-sm font-semibold">{new Intl.NumberFormat("fa-IR").format(item.quantity)}</span>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-primary disabled:opacity-40"
              disabled={busy}
              onClick={onIncrease}
              aria-label="زیاد کردن تعداد"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-destructive disabled:opacity-40"
            disabled={busy}
            onClick={onRemove}
            aria-label="حذف از سبد"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            حذف
          </button>
        </div>
      </div>
    </article>
  );
}

function OrderSummary({ cart }: { cart: Cart }) {
  return (
    <aside className="h-fit rounded-md border border-border bg-card p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-foreground">خلاصه سفارش</h2>
      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="تعداد کالا" value={new Intl.NumberFormat("fa-IR").format(cart.itemCount)} />
        <SummaryRow label="جمع سبد" value={formatPrice(cart.subtotal)} strong />
        <div className="rounded-md bg-background p-3 text-xs leading-6 text-muted-foreground">
          هزینه ارسال و روش پرداخت در مرحله ثبت سفارش مشخص می شود.
        </div>
      </div>
      <Button asChild className="mt-6 w-full">
        <Link href="/checkout">ادامه ثبت سفارش</Link>
      </Button>
    </aside>
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
    <div className="rounded-md border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
      <Button asChild className="mt-6">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="grid gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-[128px_minmax(0,1fr)]">
            <div className="aspect-square animate-pulse rounded-md bg-secondary" />
            <div className="space-y-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-secondary" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
              <div className="h-10 w-32 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-md bg-secondary" />
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}
