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
          "flex aspect-[1.12/1] items-end overflow-hidden rounded-md border border-border bg-[radial-gradient(circle_at_30%_20%,hsl(var(--luxury-gold)/0.2),transparent_34%),linear-gradient(145deg,hsl(var(--secondary)),hsl(var(--card)))] p-5 sm:aspect-[4/5]",
          className
        )}
      >
        <span className="text-xs font-medium text-muted-foreground">{product.name}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[1.12/1] overflow-hidden rounded-md border border-border bg-secondary sm:aspect-[4/5]", className)}>
      <Image
        src={image.url}
        alt={image.altText || product.name}
        fill
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 25vw"
        className="object-cover transition duration-500 ease-out group-hover:scale-[1.035]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(37,31,24,0.16)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
    </div>
  );
}
