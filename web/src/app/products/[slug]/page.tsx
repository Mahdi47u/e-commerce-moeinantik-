"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Package } from "lucide-react";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import { ProductImage } from "@/components/product/ProductImage";
import { useAuth } from "@/context/AuthContext";
import { addCartItem } from "@/services/cartService";
import { getProduct } from "@/services/catalogService";
import type { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    getProduct(params.slug)
      .then((nextProduct) => {
        if (mounted) {
          setProduct(nextProduct);
        }
      })
      .catch((error) => {
        if (mounted) {
          setError(error instanceof Error ? error.message : "دریافت محصول ناموفق بود.");
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
  }, [params.slug]);

  const primaryVariant = useMemo(() => product?.variants[0], [product]);

  async function handleAddToCart() {
    if (!token) {
      setCartMessage("برای افزودن محصول به سبد خرید ابتدا وارد شوید.");
      return;
    }

    if (!primaryVariant) {
      setCartMessage("برای این محصول گزینه قابل خرید ثبت نشده است.");
      return;
    }

    setAddingToCart(true);
    setCartMessage("");
    try {
      await addCartItem(token, primaryVariant.id, 1);
      setCartMessage("محصول به سبد خرید اضافه شد.");
    } catch (error) {
      setCartMessage(error instanceof Error ? error.message : "افزودن به سبد خرید ناموفق بود.");
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="container py-8">
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/products">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            بازگشت به محصولات
          </Link>
        </Button>

        {loading && <DetailSkeleton />}

        {!loading && error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && product && (
          <section className="grid gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
            <div>
              <ProductImage product={product} priority className="shadow-soft" />
              {product.galleryImages.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.galleryImages.slice(1, 5).map((image) => (
                    <div key={image.id} className="aspect-square overflow-hidden rounded-md border border-border bg-secondary">
                      <img src={image.url} alt={image.altText || product.name} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <article className="lg:pt-8">
              {product.categoryName && (
                <p className="text-sm font-medium text-primary">{product.categoryName}</p>
              )}
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  {product.shortDescription}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-border py-5">
                {primaryVariant && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">قیمت</p>
                    <p className="mt-1 text-2xl font-semibold text-primary">{formatPrice(primaryVariant.price)}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-5 w-5 text-primary" aria-hidden="true" />
                  {primaryVariant && primaryVariant.stockQuantity > 0 ? "موجود در انبار" : "تماس برای موجودی"}
                </div>
              </div>

              {product.attributes.length > 0 && (
                <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                  {product.attributes.map((attribute) => (
                    <div key={attribute.id} className="rounded-md border border-border bg-card p-4">
                      <dt className="text-xs font-medium text-muted-foreground">{attribute.attributeName}</dt>
                      <dd className="mt-2 text-sm font-semibold text-foreground">{attributeValue(attribute)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {product.description && (
                <div className="mt-8 max-w-3xl text-sm leading-8 text-foreground">
                  {product.description}
                </div>
              )}

              <div className="mt-8 rounded-md border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-7 text-muted-foreground">
                    محصول را به سبد خرید اضافه کنید. پرداخت و ثبت سفارش در فاز بعدی تکمیل می‌شود.
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button type="button" disabled={addingToCart || !primaryVariant} onClick={handleAddToCart}>
                    {addingToCart ? "در حال افزودن..." : "افزودن به سبد خرید"}
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="/cart">مشاهده سبد</Link>
                  </Button>
                </div>
                {cartMessage && <p className="mt-4 text-sm font-medium text-primary">{cartMessage}</p>}
              </div>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
      <div className="aspect-[4/5] animate-pulse rounded-md bg-secondary" />
      <div className="space-y-5 pt-8">
        <div className="h-4 w-28 animate-pulse rounded bg-secondary" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-secondary" />
        <div className="h-20 w-full animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function attributeValue(attribute: Product["attributes"][number]) {
  if (attribute.attributeValue) {
    return attribute.attributeValue;
  }
  if (attribute.valueNumber !== null && attribute.valueNumber !== undefined) {
    return new Intl.NumberFormat("fa-IR").format(attribute.valueNumber);
  }
  if (attribute.valueBoolean !== null && attribute.valueBoolean !== undefined) {
    return attribute.valueBoolean ? "بله" : "خیر";
  }
  return attribute.valueText || "-";
}
