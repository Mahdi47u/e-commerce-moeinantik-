import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { StatePanel } from "@/components/ui/state-panel";
import type { Homepage } from "@/types/content";

type ProductShowcaseProps = {
  title: string;
  products: Homepage["featuredProducts"];
  emptyTitle: string;
  emptyDescription: string;
};

export function ProductShowcase({ title, products, emptyTitle, emptyDescription }: ProductShowcaseProps) {
  return (
    <section className="px-3 py-4 md:moein-home-frame md:py-7">
      <div className="mb-3 flex items-center justify-between gap-4 md:mb-5">
        <h2 className="text-base font-semibold text-foreground md:text-xl">{title}</h2>
        <Link href="/products" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground transition hover:text-primary md:gap-2 md:text-sm">
          مشاهده همه
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {products.length ? (
        <div className="grid grid-cols-1 gap-y-4 min-[520px]:grid-cols-2 min-[520px]:gap-x-3 sm:gap-x-4 sm:gap-y-7 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-5 2xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      ) : (
        <StatePanel title={emptyTitle} description={emptyDescription} actionLabel="مشاهده محصولات" actionHref="/products" />
      )}
    </section>
  );
}
