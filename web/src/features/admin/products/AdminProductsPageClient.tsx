"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Eye, PackageSearch, Pencil, Plus, RefreshCw, Save, Search, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SiteShell from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { FieldRoot, SelectField, TextArea, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/context/AuthContext";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  getAdminProduct,
  getAdminProducts,
  updateAdminProduct,
  type ProductPayload,
} from "@/services/catalogService";
import type { Role } from "@/types/auth";
import type { Category, Product, ProductStatus } from "@/types/catalog";

type ProductForm = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  variantTitle: string;
  variantSku: string;
  price: number;
  compareAtPrice: string;
  stockQuantity: number;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
  variantTitle: "پیش‌فرض",
  variantSku: "",
  price: 0,
  compareAtPrice: "",
  stockQuantity: 0,
};

export default function AdminProductsPageClient() {
  const { user, token, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProductStatus>("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canManage = hasAdminRole(user?.roles || []);
  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);
  const editing = Boolean(selectedProduct);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !canManage) {
      setLoading(false);
      return;
    }
    loadCatalog();
  }, [authLoading, token, canManage]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const statusMatches = statusFilter === "ALL" || product.status === statusFilter;
      const queryMatches =
        !normalized ||
        [product.name, product.sku, product.slug, product.categoryName].filter(Boolean).some((value) => value?.toLowerCase().includes(normalized));
      return statusMatches && queryMatches;
    });
  }, [products, query, statusFilter]);

  async function loadCatalog() {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const [nextProducts, nextCategories] = await Promise.all([getAdminProducts(token), getAdminCategories(token)]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      if (selectedProduct) {
        const fresh = nextProducts.find((product) => product.id === selectedProduct.id) || null;
        setSelectedProduct(fresh);
        if (fresh) setForm(productToForm(fresh));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت محصولات ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }

  async function selectProduct(productId: number) {
    if (!token) return;
    setError("");
    try {
      const product = await getAdminProduct(token, productId);
      setSelectedProduct(product);
      setForm(productToForm(product));
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت محصول ناموفق بود.");
    }
  }

  function startCreate() {
    setSelectedProduct(null);
    setForm(emptyForm);
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    try {
      const payload = formToPayload(form, selectedProduct);
      const saved = selectedProduct ? await updateAdminProduct(token, selectedProduct.id, payload) : await createAdminProduct(token, payload);
      await loadCatalog();
      setSelectedProduct(saved);
      setForm(productToForm(saved));
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره محصول ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(product: Product) {
    if (!token || !window.confirm(`محصول «${product.name}» حذف شود؟`)) return;
    setError("");
    try {
      await deleteAdminProduct(token, product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      if (selectedProduct?.id === product.id) startCreate();
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف محصول ناموفق بود.");
    }
  }

  return (
    <SiteShell>
      <AdminShell
        title="مدیریت محصولات"
        description="محصولات، دسته‌بندی، وضعیت انتشار، قیمت، موجودی و متای سئو را کنترل کنید. مدیریت کامل گالری در مرحله رسانه اضافه می‌شود."
        actions={
          <>
            <Button type="button" variant="secondary" onClick={loadCatalog} disabled={loading || !canManage}>
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
              به‌روزرسانی
            </Button>
            <Button type="button" onClick={startCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              محصول جدید
            </Button>
          </>
        }
      >
        {!authLoading && !canManage && <AccessDenied />}
        {error && <ErrorMessage message={error} />}

        {!loading && canManage && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
            <div className="rounded-md border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">فهرست محصولات</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatNumber(filteredProducts.length)} محصول نمایش داده می‌شود.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="flex h-10 min-w-56 items-center gap-2 rounded-md border border-border bg-background px-3">
                    <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجو" className="w-full bg-transparent text-sm outline-none" />
                  </label>
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | ProductStatus)} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none">
                    <option value="ALL">همه</option>
                    <option value="ACTIVE">فعال</option>
                    <option value="DRAFT">پیش‌نویس</option>
                    <option value="ARCHIVED">آرشیو</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">محصولی پیدا نشد.</div>
              ) : (
                filteredProducts.map((product) => {
                  const primaryImage = product.galleryImages.find((image) => image.primaryImage) || product.galleryImages[0];
                  return (
                    <div key={product.id} className="grid gap-3 border-t border-border px-4 py-4 first:border-t-0 md:grid-cols-[1fr_auto] md:items-center">
                      <button type="button" onClick={() => selectProduct(product.id)} className="flex min-w-0 items-center gap-3 text-right">
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                          {primaryImage ? <Image src={primaryImage.url} alt={primaryImage.altText || product.name} fill sizes="56px" className="object-cover" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-foreground">{product.name}</span>
                          <span className="mt-1 block truncate text-xs text-muted-foreground">{product.categoryName || "بدون دسته‌بندی"}، {formatProductPrice(product)}</span>
                        </span>
                      </button>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={statusTone(product.status)}>{statusLabel(product.status)}</StatusBadge>
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            مشاهده
                          </Link>
                        </Button>
                        <button type="button" onClick={() => selectProduct(product.id)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary" aria-label="ویرایش">
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => removeProduct(product)} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="حذف">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={saveProduct} className="h-fit rounded-md border border-border bg-card p-5 xl:sticky xl:top-24">
              <div className="mb-5 flex items-start gap-3">
                <PackageSearch className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{editing ? "ویرایش محصول" : "محصول جدید"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">فیلدهای اصلی، قیمت، موجودی و سئو را ذخیره کنید.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <FieldRoot label="نام محصول" required>
                  <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="اسلاگ">
                  <TextInput dir="ltr" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="کد کالا">
                  <TextInput dir="ltr" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="دسته‌بندی">
                  <SelectField value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                    <option value="">بدون دسته‌بندی</option>
                    {flatCategories.map(({ category, depth }) => (
                      <option key={category.id} value={category.id}>
                        {"—".repeat(depth)} {category.name}
                      </option>
                    ))}
                  </SelectField>
                </FieldRoot>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldRoot label="وضعیت">
                    <SelectField value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductStatus })}>
                      <option value="DRAFT">پیش‌نویس</option>
                      <option value="ACTIVE">فعال</option>
                      <option value="ARCHIVED">آرشیو</option>
                    </SelectField>
                  </FieldRoot>
                  <FieldRoot label="ترتیب">
                    <TextInput type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
                  </FieldRoot>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                  محصول ویژه باشد
                </label>
                <FieldRoot label="توضیح کوتاه">
                  <TextArea value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="توضیح کامل">
                  <TextArea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </FieldRoot>

                <div className="rounded-md border border-border bg-background p-4">
                  <p className="mb-3 text-sm font-semibold text-foreground">تنوع پیش‌فرض</p>
                  <div className="grid gap-4">
                    <FieldRoot label="عنوان تنوع">
                      <TextInput value={form.variantTitle} onChange={(event) => setForm({ ...form, variantTitle: event.target.value })} />
                    </FieldRoot>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FieldRoot label="قیمت" required>
                        <TextInput type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
                      </FieldRoot>
                      <FieldRoot label="موجودی">
                        <TextInput type="number" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: Number(event.target.value) })} />
                      </FieldRoot>
                    </div>
                  </div>
                </div>

                <FieldRoot label="عنوان سئو">
                  <TextInput value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
                </FieldRoot>
                <FieldRoot label="توضیح سئو">
                  <TextArea value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} />
                </FieldRoot>
                <Button type="submit" loading={saving}>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  ذخیره محصول
                </Button>
              </div>
            </form>
          </div>
        )}
      </AdminShell>
    </SiteShell>
  );
}

function productToForm(product: Product): ProductForm {
  const variant = product.variants[0];
  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    categoryId: product.categoryId ? String(product.categoryId) : "",
    status: product.status,
    featured: product.featured,
    sortOrder: product.sortOrder,
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    variantTitle: variant?.title || "پیش‌فرض",
    variantSku: variant?.sku || "",
    price: variant?.price || 0,
    compareAtPrice: variant?.compareAtPrice ? String(variant.compareAtPrice) : "",
    stockQuantity: variant?.stockQuantity || 0,
  };
}

function formToPayload(form: ProductForm, current: Product | null): ProductPayload {
  return {
    name: form.name,
    slug: form.slug.trim() || undefined,
    sku: form.sku.trim() || undefined,
    shortDescription: form.shortDescription.trim() || undefined,
    description: form.description.trim() || undefined,
    categoryId: form.categoryId ? Number(form.categoryId) : null,
    status: form.status,
    featured: form.featured,
    sortOrder: form.sortOrder,
    seoTitle: form.seoTitle.trim() || undefined,
    seoDescription: form.seoDescription.trim() || undefined,
    variants: [
      {
        title: form.variantTitle.trim() || "پیش‌فرض",
        sku: form.variantSku.trim() || null,
        price: form.price,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stockQuantity: form.stockQuantity,
        active: true,
        sortOrder: 0,
      },
    ],
    galleryImages: (current?.galleryImages || []).map((image) => ({
      mediaAssetId: image.mediaAssetId,
      altText: image.altText || null,
      primaryImage: image.primaryImage,
      sortOrder: image.sortOrder,
    })),
    attributes: (current?.attributes || [])
      .filter((attribute) => attribute.attributeId)
      .map((attribute) => ({
        attributeId: attribute.attributeId,
        attributeValueId: attribute.attributeValueId || null,
        valueText: attribute.valueText || null,
        valueNumber: attribute.valueNumber || null,
        valueBoolean: attribute.valueBoolean || null,
        sortOrder: attribute.sortOrder,
      })),
  };
}

function flattenCategories(categories: Category[], depth = 0): Array<{ category: Category; depth: number }> {
  return categories.flatMap((category) => [{ category, depth }, ...flattenCategories(category.children || [], depth + 1)]);
}

function AccessDenied() {
  return <div className="rounded-md border border-border bg-card p-8 text-center text-sm text-muted-foreground">برای مدیریت محصولات باید با نقش مدیر وارد شوید.</div>;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="mb-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function hasAdminRole(roles: Role[]) {
  return roles.includes("ADMIN") || roles.includes("SUPERADMIN");
}

function statusTone(status: ProductStatus) {
  return status === "ACTIVE" ? "success" : status === "DRAFT" ? "warning" : "neutral";
}

function statusLabel(status: ProductStatus) {
  return status === "ACTIVE" ? "فعال" : status === "DRAFT" ? "پیش‌نویس" : "آرشیو";
}

function formatProductPrice(product: Product) {
  const prices = product.variants.map((variant) => variant.price);
  if (!prices.length) return "بدون قیمت";
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} تا ${formatPrice(maxPrice)}`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
