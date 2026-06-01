import Image from "next/image";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  product: Product;
  priority?: boolean;
  className?: string;
};

export function ProductImage({ product, priority = false, className }: ProductImageProps) {
  const image = product.galleryImages.find((item) => item.primaryImage) || product.galleryImages[0];

  if (!image) {
    return (
      <div
        className={cn(
          "flex aspect-[4/5] items-end rounded-md border border-border bg-[radial-gradient(circle_at_30%_20%,hsl(var(--luxury-gold)/0.22),transparent_36%),linear-gradient(145deg,hsl(var(--secondary)),hsl(var(--card)))] p-5",
          className
        )}
      >
        <span className="text-xs font-medium text-muted-foreground">{product.name}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-secondary", className)}>
      <Image
        src={image.url}
        alt={image.altText || product.name}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
}
