"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getProducts } from "@/services/catalogService";
import type { Category, Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    Promise.all([getProducts(selectedCategory || undefined), getCategories()])
      .then(([nextProducts, nextCategories]) => {
        if (!mounted) {
          return;
        }
        setProducts(nextProducts);
        setCategories(nextCategories);
      })
      .catch((error) => {
        if (mounted) {
          setError(error instanceof Error ? error.message : "دریافت محصولات ناموفق بود.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedCategory]);

  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.shortDescription, product.categoryName]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery))
    );
  }, [products, query]);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border/70 bg-card">
        <div className="container grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="text-sm font-medium text-primary">گالری محصولات</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              انتخاب قطعات آنتیک برای خانه‌هایی که شخصیت دارند
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو در محصولات"
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="h-4 w-4" aria-hidden="true" />
            دسته‌بندی
          </div>
          <div className="mt-4 flex flex-wrap gap-2 lg:block lg:space-y-2">
            <CategoryButton active={!selectedCategory} onClick={() => setSelectedCategory("")}>
              همه محصولات
            </CategoryButton>
            {flatCategories.map((category) => (
              <CategoryButton
                key={category.slug}
                active={selectedCategory === category.slug}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </div>
        </aside>

        <div>
          {loading && <ProductGridSkeleton />}

          {!loading && error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <div className="rounded-md border border-border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground">هنوز محصولی برای نمایش نیست</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                وقتی محصولات از پنل مدیریت ثبت شوند، اینجا به شکل گالری فروشگاهی نمایش داده می‌شوند.
              </p>
              <Button asChild className="mt-6">
                <Link href="/">بازگشت به صفحه اصلی</Link>
              </Button>
            </div>
          )}

          {!loading && !error && visibleProducts.length > 0 && (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CategoryButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground lg:w-full"
          : "rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 lg:w-full"
      }
    >
      {children}
    </button>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[4/5] animate-pulse rounded-md bg-secondary" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children || [])]);
}
