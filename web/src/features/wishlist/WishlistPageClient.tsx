"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getWishlist, removeWishlistItem } from "@/services/wishlistService";
import type { WishlistItem } from "@/types/wishlist";

export default function WishlistPage() {
  const { token, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyProductId, setBusyProductId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    getWishlist(token)
      .then(setItems)
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت علاقه مندی ها ناموفق بود."))
      .finally(() => setLoading(false));
  }, [authLoading, token]);

  async function remove(productId: number) {
    if (!token) {
      return;
    }

    setBusyProductId(productId);
    setError("");
    try {
      await removeWishlistItem(token, productId);
      setItems((current) => current.filter((item) => item.product.id !== productId));
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف از علاقه مندی ها ناموفق بود.");
    } finally {
      setBusyProductId(null);
    }
  }

  return (
    <SiteShell>
      <section className="border-b border-border/70 bg-card">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-10">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md border border-border bg-background text-primary">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-primary">علاقه مندی ها</p>
              <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">قطعات ذخیره شده</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                محصولاتی که برای بررسی یا خرید بعدی ذخیره کرده اید در این بخش نمایش داده می شوند.
              </p>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link href="/products">بازگشت به فروشگاه</Link>
          </Button>
        </div>
      </section>

      <section className="container py-10">
        {loading && <WishlistSkeleton />}

        {!loading && !token && (
          <Empty
            title="برای ذخیره علاقه مندی ها وارد شوید"
            description="با ورود به حساب کاربری می توانید محصولات محبوب خود را برای خرید بعدی نگه دارید."
            href="/login"
            label="ورود"
          />
        )}

        {!loading && token && items.length === 0 && (
          <Empty
            title="لیست علاقه مندی ها خالی است"
            description="از صفحه محصولات، قطعات مورد علاقه خود را به این لیست اضافه کنید."
            href="/products"
            label="مشاهده محصولات"
          />
        )}

        {error && (
          <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && items.length > 0 && (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {new Intl.NumberFormat("fa-IR").format(items.length)} محصول ذخیره شده
            </p>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.id}>
                  <ProductCard product={item.product} />
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4 w-full"
                    disabled={busyProductId === item.product.id}
                    onClick={() => remove(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {busyProductId === item.product.id ? "در حال حذف..." : "حذف از علاقه مندی ها"}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </SiteShell>
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

function WishlistSkeleton() {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[4/5] animate-pulse rounded-md bg-secondary" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
