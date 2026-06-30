import Link from "next/link";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Product, ProductStatus } from "@/types/catalog";
import { formatNumber, formatProductPrice, productStatusLabel, productStatusTone } from "./productFormatters";

export function ProductListTable({
  products,
  query,
  statusFilter,
  setQuery,
  setStatusFilter,
  removeProduct,
}: {
  products: Product[];
  query: string;
  statusFilter: "ALL" | ProductStatus;
  setQuery: (value: string) => void;
  setStatusFilter: (value: "ALL" | ProductStatus) => void;
  removeProduct: (product: Product) => void;
}) {
  return (
    <section className="rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">فهرست محصولات</h2>
          <p className="mt-1 text-xs text-muted-foreground">{formatNumber(products.length)} محصول نمایش داده می شود.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/dashboard/products/new">
              <Plus className="h-4 w-4" aria-hidden="true" />
              محصول جدید
            </Link>
          </Button>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | ProductStatus)} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none">
            <option value="ALL">همه</option>
            <option value="ACTIVE">فعال</option>
            <option value="DRAFT">پیش نویس</option>
            <option value="ARCHIVED">آرشیو</option>
          </select>
          <label className="flex h-10 min-w-56 items-center gap-2 rounded-md border border-border bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو" className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>
      </div>

      <div className="hidden grid-cols-[48px_minmax(260px,1fr)_120px_130px_110px_160px] border-b border-border px-4 py-3 text-xs font-semibold text-muted-foreground xl:grid">
        <span />
        <span>نام</span>
        <span>وضعیت</span>
        <span>موجودی</span>
        <span>قیمت</span>
        <span className="text-left">عملیات</span>
      </div>

      <div className="divide-y divide-border">
        {products.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">محصولی پیدا نشد.</p>}
        {products.map((product) => {
          const primaryImage = product.galleryImages.find((image) => image.primaryImage) || product.galleryImages[0];
          const stock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);

          return (
            <div key={product.id} className="grid gap-3 px-4 py-3 text-sm xl:grid-cols-[48px_minmax(260px,1fr)_120px_130px_110px_160px] xl:items-center">
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-secondary text-xs text-muted-foreground">
                {primaryImage ? <img src={primaryImage.url} alt={primaryImage.altText || product.name} className="h-full w-full object-cover" /> : "تصویر"}
              </span>
              <span>
                <Link href={`/admin/dashboard/products/${product.id}`} className="font-semibold text-foreground hover:text-primary">
                  {product.name}
                </Link>
                <span className="mt-1 block text-xs text-muted-foreground">{product.categoryName || "بدون دسته"}، {product.sku || product.slug}</span>
              </span>
              <span><StatusBadge tone={productStatusTone(product.status)}>{productStatusLabel(product.status)}</StatusBadge></span>
              <span className="text-muted-foreground">{formatNumber(stock)} عدد</span>
              <span className="font-semibold text-primary moein-tabular">{formatProductPrice(product)}</span>
              <span className="flex flex-wrap justify-start gap-2 xl:justify-end">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/dashboard/products/${product.id}`}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    ویرایش
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    مشاهده
                  </Link>
                </Button>
                <button type="button" onClick={() => removeProduct(product)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="حذف">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

