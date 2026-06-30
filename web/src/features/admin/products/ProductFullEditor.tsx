"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Image as ImageIcon, Plus, Save, Star, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldRoot, SelectField, TextArea, TextInput } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { createAdminProduct, deleteAdminProduct, getAdminProduct, updateAdminProduct } from "@/services/catalogService";
import { uploadAdminMedia } from "@/services/mediaService";
import type { Category, Product, ProductStatus } from "@/types/catalog";
import { RichTextEditor } from "./RichTextEditor";
import { productToForm, productFormToPayload } from "./productFormMapper";
import { flattenProductCategories } from "./productCategoryUtils";
import { emptyProductForm, emptyVariantForm, type ProductEditorTarget, type ProductForm, type ProductGalleryForm, type ProductVariantForm } from "./productTypes";

export function ProductFullEditor({
  token,
  categories,
  onChanged,
  target,
}: {
  token: string | null;
  categories: Category[];
  onChanged: () => Promise<void>;
  target: Exclude<ProductEditorTarget, { mode: "list" }>;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [loading, setLoading] = useState(target.mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const flatCategories = useMemo(() => flattenProductCategories(categories), [categories]);

  useEffect(() => {
    if (!token || target.mode !== "edit") {
      setProduct(null);
      setForm(emptyProductForm);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    getAdminProduct(token, target.productId)
      .then((nextProduct) => {
        setProduct(nextProduct);
        setForm(productToForm(nextProduct));
      })
      .catch((error) => setError(error instanceof Error ? error.message : "دریافت محصول ناموفق بود."))
      .finally(() => setLoading(false));
  }, [token, target]);

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    try {
      const payload = productFormToPayload(form, product);
      const saved = product ? await updateAdminProduct(token, product.id, payload) : await createAdminProduct(token, payload);
      setProduct(saved);
      setForm(productToForm(saved));
      await onChanged();
      router.replace(`/admin/dashboard/products/${saved.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "ذخیره محصول ناموفق بود.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct() {
    if (!token || !product || !window.confirm(`محصول «${product.name}» حذف شود؟`)) return;

    setError("");
    try {
      await deleteAdminProduct(token, product.id);
      await onChanged();
      router.push("/admin/dashboard/products");
    } catch (error) {
      setError(error instanceof Error ? error.message : "حذف محصول ناموفق بود.");
    }
  }

  async function uploadImages(event: React.ChangeEvent<HTMLInputElement>) {
    if (!token) return;
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(files.map((file) => uploadAdminMedia(token, file, form.imageAltText || form.name)));
      const existingIds = new Set(form.galleryImages.map((image) => image.mediaAssetId));
      const nextImages = uploaded
        .filter((asset) => !existingIds.has(asset.id))
        .map((asset, index): ProductGalleryForm => ({
          mediaAssetId: asset.id,
          url: asset.url,
          altText: asset.altText || form.imageAltText || form.name,
          primaryImage: form.galleryImages.length === 0 && index === 0,
          sortOrder: form.galleryImages.length + index,
        }));
      setForm((current) => ({ ...current, galleryImages: [...current.galleryImages, ...nextImages] }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "آپلود فایل ناموفق بود.");
    } finally {
      setUploading(false);
    }
  }

  function updateVariant(index: number, updates: Partial<ProductVariantForm>) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) => (variantIndex === index ? { ...variant, ...updates } : variant)),
    }));
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          ...emptyVariantForm,
          title: `Variant ${current.variants.length + 1}`,
          sortOrder: current.variants.length,
        },
      ],
    }));
  }

  function removeVariant(index: number) {
    setForm((current) => ({
      ...current,
      variants: current.variants.length === 1 ? current.variants : current.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  }

  function updateGalleryImage(index: number, updates: Partial<ProductGalleryForm>) {
    setForm((current) => ({
      ...current,
      galleryImages: current.galleryImages.map((image, imageIndex) => {
        if (updates.primaryImage && imageIndex !== index) {
          return { ...image, primaryImage: false };
        }
        return imageIndex === index ? { ...image, ...updates } : image;
      }),
    }));
  }

  function removeGalleryImage(index: number) {
    setForm((current) => {
      const nextImages = current.galleryImages.filter((_, imageIndex) => imageIndex !== index);
      if (nextImages.length > 0 && !nextImages.some((image) => image.primaryImage)) {
        nextImages[0] = { ...nextImages[0], primaryImage: true };
      }
      return { ...current, galleryImages: nextImages };
    });
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-md bg-secondary" />;
  }

  return (
    <form onSubmit={saveProduct} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{product ? "ویرایش محصول" : "افزودن محصول جدید"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">اطلاعات کامل محصول، قیمت، موجودی، توضیحات، سئو و داده های اصلی فروشگاه.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard/products">بازگشت به فهرست</Link>
          </Button>
          {product && (
            <Button type="button" variant="destructive" onClick={removeProduct}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              حذف
            </Button>
          )}
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            ذخیره محصول
          </Button>
        </div>
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5 rounded-md border border-border bg-card p-5">
          <h3 className="text-lg font-semibold text-foreground">اطلاعات اصلی</h3>
          <FieldRoot label="نام محصول" required>
            <TextInput value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </FieldRoot>
          <FieldRoot label="توضیح کوتاه">
            <RichTextEditor value={form.shortDescription} onChange={(value) => setForm({ ...form, shortDescription: value })} minHeight={150} />
          </FieldRoot>
          <FieldRoot label="توضیحات کامل محصول">
            <RichTextEditor value={form.description} onChange={(value) => setForm({ ...form, description: value })} minHeight={260} />
          </FieldRoot>

          <div className="rounded-md border border-border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Product variants</h3>
                <p className="mt-1 text-sm text-muted-foreground">Use titles like Red / Large / Ceramic / 500 ml. Each row has its own SKU, price and stock.</p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={addVariant}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add variant
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {form.variants.map((variant, index) => (
                <div key={index} className="rounded-md border border-border bg-card p-3">
                  <div className="grid gap-3 lg:grid-cols-[minmax(180px,1.2fr)_minmax(120px,0.8fr)_120px_120px_100px_auto] lg:items-end">
                    <FieldRoot label="Variant title">
                      <TextInput value={variant.title} onChange={(event) => updateVariant(index, { title: event.target.value })} />
                    </FieldRoot>
                    <FieldRoot label="SKU">
                      <TextInput dir="ltr" value={variant.sku} onChange={(event) => updateVariant(index, { sku: event.target.value })} />
                    </FieldRoot>
                    <FieldRoot label="Price" required>
                      <TextInput type="number" value={variant.price} onChange={(event) => updateVariant(index, { price: Number(event.target.value) })} />
                    </FieldRoot>
                    <FieldRoot label="Sale price">
                      <TextInput type="number" value={variant.compareAtPrice} onChange={(event) => updateVariant(index, { compareAtPrice: event.target.value })} />
                    </FieldRoot>
                    <FieldRoot label="Stock">
                      <TextInput type="number" value={variant.stockQuantity} onChange={(event) => updateVariant(index, { stockQuantity: Number(event.target.value) })} />
                    </FieldRoot>
                    <div className="flex items-center gap-2">
                      <label className="flex h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground">
                        <input type="checkbox" checked={variant.active} onChange={(event) => updateVariant(index, { active: event.target.checked })} />
                        Active
                      </label>
                      <button type="button" onClick={() => removeVariant(index)} className="grid h-11 w-11 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive" aria-label="Remove variant" disabled={form.variants.length === 1}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-background p-4">
            <h3 className="text-base font-semibold text-foreground">سئو</h3>
            <div className="mt-4 grid gap-4">
              <FieldRoot label="عنوان سئو">
                <TextInput value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="توضیح سئو">
                <TextArea value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} />
              </FieldRoot>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-md border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">انتشار</h3>
            <div className="mt-4 grid gap-4">
              <FieldRoot label="وضعیت">
                <SelectField value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductStatus })}>
                  <option value="DRAFT">پیش نویس</option>
                  <option value="ACTIVE">فعال</option>
                  <option value="ARCHIVED">آرشیو</option>
                </SelectField>
              </FieldRoot>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
                محصول ویژه باشد
              </label>
              <Button type="submit" loading={saving} className="w-full">
                <Save className="h-4 w-4" aria-hidden="true" />
                ذخیره
              </Button>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-foreground">دسته بندی و شناسه</h3>
            <div className="mt-4 grid gap-4">
              <FieldRoot label="دسته بندی">
                <SelectField value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}>
                  <option value="">بدون دسته بندی</option>
                  {flatCategories.map(({ category, depth }) => (
                    <option key={category.id} value={category.id}>
                      {"-".repeat(depth)} {category.name}
                    </option>
                  ))}
                </SelectField>
              </FieldRoot>
              <FieldRoot label="اسلاگ">
                <TextInput dir="ltr" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="کد کالا">
                <TextInput dir="ltr" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
              </FieldRoot>
              <FieldRoot label="ترتیب نمایش">
                <TextInput type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} />
              </FieldRoot>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">Images and media</h3>
              <ImageIcon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="mt-4 grid gap-4">
              <FieldRoot label="Default image alt text">
                <TextInput value={form.imageAltText} onChange={(event) => setForm({ ...form, imageAltText: event.target.value })} />
              </FieldRoot>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-background px-4 py-5 text-center text-sm text-muted-foreground transition hover:border-primary hover:text-foreground">
                <Upload className={uploading ? "h-5 w-5 animate-pulse text-primary" : "h-5 w-5 text-primary"} aria-hidden="true" />
                <span className="font-semibold">{uploading ? "Uploading..." : "Upload images on this page"}</span>
                <span className="text-xs">Choose product photos, variant photos, 360 frames, or custom product files.</span>
                <input type="file" accept="image/*,video/*" multiple className="sr-only" onChange={uploadImages} disabled={uploading} />
              </label>
              <FieldRoot label="Product video URL">
                <TextInput dir="ltr" value={form.productVideo} onChange={(event) => setForm({ ...form, productVideo: event.target.value })} />
              </FieldRoot>
              <div className="space-y-3">
                {form.galleryImages.length === 0 && <p className="rounded-md border border-border bg-background p-4 text-sm text-muted-foreground">No media yet. Upload files here, then save the product.</p>}
                {form.galleryImages.map((image, index) => (
                  <div key={`${image.mediaAssetId}-${index}`} className="grid gap-3 rounded-md border border-border bg-background p-3">
                    <div className="flex items-start gap-3">
                      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <img src={image.url} alt={image.altText || form.name || "Product media"} className="h-full w-full object-cover" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">Media #{image.mediaAssetId}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateGalleryImage(index, { primaryImage: true })} className={cn("inline-flex h-8 items-center gap-2 rounded-md border px-2 text-xs font-semibold", image.primaryImage ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                            <Star className="h-3.5 w-3.5" aria-hidden="true" />
                            Main
                          </button>
                          <button type="button" onClick={() => removeGalleryImage(index)} className="inline-flex h-8 items-center gap-2 rounded-md border border-border px-2 text-xs font-semibold text-muted-foreground hover:text-destructive">
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <FieldRoot label="Alt text">
                      <TextInput value={image.altText} onChange={(event) => updateGalleryImage(index, { altText: event.target.value })} />
                    </FieldRoot>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}

