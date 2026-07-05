import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);
  const inStock = totalStock > 0;
  const priceLabel = formatProductPrice(product);
  const isNew = isNewProduct(product.createdAt);

  return (
    <article
      className={cn(
        "group rounded-md border border-border bg-card transition duration-200 hover:border-primary/35 hover:shadow-[0_8px_18px_-14px_rgba(33,30,26,0.45)]",
        compact ? "p-1.5" : "p-1.5 sm:p-2"
      )}
    >
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ProductImage product={product} className={cn("border-0 shadow-none", compact && "aspect-square sm:aspect-[1/1.04]")} />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 grid place-items-center rounded-md bg-card/92 text-muted-foreground shadow-[0_6px_12px_-10px_rgba(33,30,26,0.6)] transition hover:bg-background hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            compact ? "h-7 w-7" : "h-7 w-7 sm:right-3 sm:top-3 sm:h-8 sm:w-8"
          )}
          aria-label={`افزودن ${product.name} به علاقه‌مندی‌ها`}
          title="افزودن به علاقه‌مندی‌ها"
        >
          <Heart className={cn("h-3.5 w-3.5", !compact && "sm:h-4 sm:w-4")} aria-hidden="true" />
        </button>

        {isNew && (
          <span
            className={cn(
              "absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground",
              !compact && "sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs"
            )}
          >
            جدید
          </span>
        )}
      </div>

      <div className={cn("px-0.5 pb-1", compact ? "pt-2.5" : "pt-3 sm:px-1 sm:pt-4")}>
        <div className={compact ? "min-h-[3.85rem]" : "min-h-[4.35rem] sm:min-h-[4.75rem]"}>
          <Link href={`/products/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <h2
              className={cn(
                "moein-wrap line-clamp-2 font-semibold text-foreground transition group-hover:text-primary",
                compact ? "text-[13px] leading-6" : "text-[13px] leading-6 sm:text-base sm:leading-7"
              )}
            >
              {product.name}
            </h2>
          </Link>
          {product.categoryName && (
            <p className={cn("mt-1 line-clamp-1 text-[11px] font-medium text-muted-foreground", !compact && "sm:text-xs")}>{product.categoryName}</p>
          )}
        </div>

        <div className={cn("mt-2 flex items-end justify-between gap-2", !compact && "sm:mt-3 sm:gap-3")}>
          <div className="min-w-0">
            <p className={cn("moein-tabular line-clamp-1 font-bold text-primary", compact ? "text-[12px]" : "text-[12px] sm:text-sm")}>{priceLabel}</p>
            <StatusBadge tone={inStock ? "success" : "warning"} className={cn("mt-1.5 text-[10px]", !compact && "sm:mt-2 sm:text-xs")}>
              {inStock ? "موجود" : "بررسی موجودی"}
            </StatusBadge>
          </div>

          <button
            type="button"
            className={cn(
              "grid shrink-0 place-items-center rounded-md border border-border bg-background text-primary transition hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              compact ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10"
            )}
            aria-label={`افزودن ${product.name} به سبد خرید`}
            title="افزودن به سبد خرید"
            disabled={!inStock}
          >
            <ShoppingCart className={cn("h-3.5 w-3.5", !compact && "sm:h-4 sm:w-4")} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function formatProductPrice(product: Product) {
  const prices = product.variants.map((variant) => variant.price);

  if (prices.length === 0) {
    return "قیمت ثبت نشده";
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }

  return `${formatPrice(minPrice)} تا ${formatPrice(maxPrice)}`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function isNewProduct(createdAt: string) {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return false;
  }

  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  return Date.now() - createdTime <= thirtyDays;
}
