import { SlidersHorizontal } from "lucide-react";
import type { FlatCategory } from "@/features/catalog/types";

type CatalogToolbarProps = {
  activeCategory?: FlatCategory;
  loading: boolean;
  visibleCount: number;
};

export function CatalogToolbar({ activeCategory, loading, visibleCount }: CatalogToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card/70 px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-foreground">
          {activeCategory ? activeCategory.name : "همه محصولات"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {loading ? "در حال دریافت محصولات..." : `${new Intl.NumberFormat("fa-IR").format(visibleCount)} محصول برای مشاهده`}
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
        مرتب‌سازی پیش‌فرض
      </div>
    </div>
  );
}
