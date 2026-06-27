import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/ui/state-panel";
import type { Product } from "@/types/catalog";

type ProductGridProps = {
  products: Product[];
  loading: boolean;
  error: string;
  hasQuery: boolean;
};

export function ProductGrid({ products, loading, error, hasQuery }: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (error) {
    return (
      <StatePanel
        tone="error"
        title="محصولات دریافت نشد"
        description={error}
        actionLabel="تلاش دوباره"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (products.length === 0) {
    return <EmptyProductsState hasQuery={hasQuery} />;
  }

  return (
    <div className="grid gap-x-7 gap-y-11 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-x-7 gap-y-11 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[4/5] animate-pulse rounded-md bg-secondary" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-secondary" />
          <div className="mt-4 h-8 w-full animate-pulse rounded bg-secondary/70" />
        </div>
      ))}
    </div>
  );
}

function EmptyProductsState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <StatePanel
      title={hasQuery ? "محصولی با این جستجو پیدا نشد" : "هنوز محصولی برای نمایش نیست"}
      description={
        hasQuery
          ? "عبارت جستجو را کوتاه‌تر کنید یا از دسته‌بندی‌های فروشگاه کمک بگیرید."
          : "وقتی محصولات از پنل مدیریت ثبت و فعال شوند، اینجا به شکل گالری فروشگاهی نمایش داده می‌شوند."
      }
    >
      <Button asChild className="mt-6">
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </Button>
    </StatePanel>
  );
}
