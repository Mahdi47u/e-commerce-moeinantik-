"use client";

import Link from "next/link";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { getCategories, getProducts } from "@/services/catalogService";
import type { Category, Product } from "@/types/catalog";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return new URLSearchParams(window.location.search).get("category") || "";
  });
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
  const activeCategory = useMemo(
    () => flatCategories.find((category) => category.slug === selectedCategory),
    [flatCategories, selectedCategory]
  );
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
    <SiteShell>
      <section className="border-b border-border/70 bg-card">
        <div className="container grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <p className="text-sm font-medium text-primary">گالری محصولات</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              انتخاب قطعات آنتیک برای خانه هایی که شخصیت دارند
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              محصولات را بر اساس دسته بندی فیلتر کنید یا با جستجو، قطعه مورد نظر خودتان را سریع تر پیدا کنید.
            </p>
          </div>
          <label className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">جستجو در محصولات</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو در محصولات"
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </section>

      <section className="container grid gap-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Filter className="h-4 w-4" aria-hidden="true" />
                دسته بندی
              </div>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("")}
                  className="text-xs font-medium text-primary hover:text-foreground"
                >
                  حذف فیلتر
                </button>
              )}
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
                  depth={category.depth}
                >
                  {category.name}
                </CategoryButton>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {activeCategory ? activeCategory.name : "همه محصولات"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {loading ? "در حال دریافت محصولات..." : `${new Intl.NumberFormat("fa-IR").format(visibleProducts.length)} محصول`}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              مرتب سازی پیش فرض
            </div>
          </div>

          {loading && <ProductGridSkeleton />}

          {!loading && error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <EmptyProductsState hasQuery={Boolean(query.trim())} />
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
    </SiteShell>
  );
}

function CategoryButton({
  active,
  onClick,
  children,
  depth = 0,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  depth?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ paddingInlineStart: `${12 + depth * 12}px` }}
      className={
        active
          ? "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground lg:w-full lg:text-right"
          : "rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 lg:w-full lg:text-right"
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

function EmptyProductsState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="rounded-md border border-border bg-card p-8 text-center">
      <h2 className="text-xl font-semibold text-foreground">
        {hasQuery ? "محصولی با این جستجو پیدا نشد" : "هنوز محصولی برای نمایش نیست"}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        {hasQuery
          ? "عبارت جستجو را کوتاه تر کنید یا از دسته بندی های فروشگاه کمک بگیرید."
          : "وقتی محصولات از پنل مدیریت ثبت و فعال شوند، اینجا به شکل گالری فروشگاهی نمایش داده می شوند."}
      </p>
      <Button asChild className="mt-6">
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </Button>
    </div>
  );
}

type FlatCategory = Category & {
  depth: number;
};

function flattenCategories(categories: Category[], depth = 0): FlatCategory[] {
  return categories.flatMap((category) => [
    { ...category, depth },
    ...flattenCategories(category.children || [], depth + 1),
  ]);
}
