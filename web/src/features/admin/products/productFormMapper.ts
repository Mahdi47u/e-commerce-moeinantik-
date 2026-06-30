import type { ProductPayload } from "@/services/catalogService";
import type { Product, ProductGalleryImage, ProductVariant } from "@/types/catalog";
import { emptyVariantForm, type ProductForm, type ProductGalleryForm, type ProductVariantForm } from "./productTypes";

export function productToForm(product: Product): ProductForm {
  const variant = product.variants[0];
  const galleryImages = product.galleryImages.map(galleryImageToForm);
  const variants = product.variants.length > 0 ? product.variants.map(productVariantToForm) : [{ ...emptyVariantForm }];

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku || "",
    brand: attributeValueBySlug(product, "brand"),
    tags: attributeValueBySlug(product, "tags"),
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    categoryId: product.categoryId ? String(product.categoryId) : "",
    status: product.status,
    featured: product.featured,
    sortOrder: product.sortOrder,
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    seoSlug: product.slug,
    imageAltText: galleryImages.find((image) => image.primaryImage)?.altText || galleryImages[0]?.altText || "",
    productVideo: attributeValueBySlug(product, "product-video"),
    variantTitle: variant?.title || "پیش فرض",
    variantSku: variant?.sku || "",
    price: variant?.price || 0,
    compareAtPrice: variant?.compareAtPrice ? String(variant.compareAtPrice) : "",
    stockQuantity: variant?.stockQuantity || 0,
    variants,
    galleryImages,
  };
}

export function productFormToPayload(form: ProductForm, current: Product | null): ProductPayload {
  const variants = form.variants.length > 0 ? form.variants : [{ ...emptyVariantForm }];
  const primaryIndex = form.galleryImages.findIndex((image) => image.primaryImage);

  return {
    name: form.name,
    slug: (form.slug || form.seoSlug).trim() || undefined,
    sku: form.sku.trim() || undefined,
    shortDescription: form.shortDescription.trim() || undefined,
    description: form.description.trim() || undefined,
    categoryId: form.categoryId ? Number(form.categoryId) : null,
    status: form.status,
    featured: form.featured,
    sortOrder: form.sortOrder,
    seoTitle: form.seoTitle.trim() || undefined,
    seoDescription: form.seoDescription.trim() || undefined,
    variants: variants.map((variant, index) => ({
      title: variant.title.trim() || `Variant ${index + 1}`,
      sku: variant.sku.trim() || null,
      price: Number(variant.price) || 0,
      compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : null,
      stockQuantity: Number(variant.stockQuantity) || 0,
      active: variant.active,
      sortOrder: Number(variant.sortOrder) || index,
    })),
    galleryImages: form.galleryImages.map((image, index) => ({
      mediaAssetId: image.mediaAssetId,
      altText: image.altText || null,
      primaryImage: primaryIndex === -1 ? index === 0 : image.primaryImage,
      sortOrder: Number(image.sortOrder) || index,
    })),
    attributes: (current?.attributes || [])
      .filter((attribute) => attribute.attributeId)
      .map((attribute) => ({
        attributeId: attribute.attributeId,
        attributeValueId: attribute.attributeValueId || null,
        valueText: productAttributeTextValue(form, attribute.attributeSlug) ?? attribute.valueText ?? null,
        valueNumber: attribute.valueNumber || null,
        valueBoolean: attribute.valueBoolean || null,
        sortOrder: attribute.sortOrder,
      })),
  };
}

function productAttributeTextValue(form: ProductForm, slug: string) {
  if (slug === "brand") return form.brand.trim() || null;
  if (slug === "tags") return form.tags.trim() || null;
  if (slug === "product-video") return form.productVideo.trim() || null;
  return undefined;
}

function productVariantToForm(variant: ProductVariant): ProductVariantForm {
  return {
    title: variant.title,
    sku: variant.sku || "",
    price: variant.price,
    compareAtPrice: variant.compareAtPrice ? String(variant.compareAtPrice) : "",
    stockQuantity: variant.stockQuantity,
    active: variant.active,
    sortOrder: variant.sortOrder,
  };
}

function galleryImageToForm(image: ProductGalleryImage): ProductGalleryForm {
  return {
    mediaAssetId: image.mediaAssetId,
    url: image.url,
    altText: image.altText || "",
    primaryImage: image.primaryImage,
    sortOrder: image.sortOrder,
  };
}

function attributeValueBySlug(product: Product, slug: string) {
  const attribute = product.attributes.find((item) => item.attributeSlug === slug);
  return attribute?.attributeValue || attribute?.valueText || (attribute?.valueNumber == null ? "" : String(attribute.valueNumber));
}

