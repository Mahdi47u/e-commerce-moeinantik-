import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductImage } from "@/components/product/ProductImage";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <ProductImage product={product} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold leading-7 text-foreground group-hover:text-primary">
            {product.name}
          </h2>
          {product.categoryName && (
            <p className="mt-1 text-xs font-medium text-muted-foreground">{product.categoryName}</p>
          )}
        </div>
        {firstVariant && (
          <p className="shrink-0 pt-1 text-sm font-semibold text-primary">
            {formatPrice(firstVariant.price)}
          </p>
        )}
      </div>
      {product.shortDescription && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
      )}
    </Link>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}
