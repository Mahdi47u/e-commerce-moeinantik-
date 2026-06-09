"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
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
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت علاقه‌مندی‌ها ناموفق بود."))
      .finally(() => setLoading(false));
  }, [authLoading, token]);

  async function remove(productId: number) {
    if (!token) {
      return;
    }

    setError("");
    try {
      await removeWishlistItem(token, productId);
      setItems((current) => current.filter((item) => item.product.id !== productId));
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف از علاقه‌مندی‌ها ناموفق بود.");
    }
  }

  return (
    <SiteShell>
      <section className="container py-10">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-primary">علاقه‌مندی‌ها</p>
            <h1 className="mt-1 text-3xl font-semibold text-foreground">قطعات ذخیره‌شده</h1>
          </div>
        </div>

        {loading && <div className="mt-8 h-40 animate-pulse rounded-md bg-secondary" />}

        {!loading && !token && <Empty title="برای ذخیره علاقه‌مندی‌ها وارد شوید" href="/login" label="ورود" />}

        {!loading && token && items.length === 0 && (
          <Empty title="لیست علاقه‌مندی‌ها خالی است" href="/products" label="مشاهده محصولات" />
        )}

        {error && <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}

        {!loading && items.length > 0 && (
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id}>
                <ProductCard product={item.product} />
                <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => remove(item.product.id)}>
                  حذف از علاقه‌مندی‌ها
                </Button>
              </div>
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
