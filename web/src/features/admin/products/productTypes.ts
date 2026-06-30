import type { ProductStatus } from "@/types/catalog";

export type ProductEditorTarget = { mode: "list" } | { mode: "new" } | { mode: "edit"; productId: number };

export type ProductForm = {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  tags: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  seoSlug: string;
  imageAltText: string;
  productVideo: string;
  variantTitle: string;
  variantSku: string;
  price: number;
  compareAtPrice: string;
  stockQuantity: number;
  variants: ProductVariantForm[];
  galleryImages: ProductGalleryForm[];
};

export type ProductVariantForm = {
  title: string;
  sku: string;
  price: number;
  compareAtPrice: string;
  stockQuantity: number;
  active: boolean;
  sortOrder: number;
};

export type ProductGalleryForm = {
  mediaAssetId: number;
  url: string;
  altText: string;
  primaryImage: boolean;
  sortOrder: number;
};

export const emptyVariantForm: ProductVariantForm = {
  title: "Default",
  sku: "",
  price: 0,
  compareAtPrice: "",
  stockQuantity: 0,
  active: true,
  sortOrder: 0,
};

export const emptyProductForm: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  brand: "",
  tags: "",
  shortDescription: "",
  description: "",
  categoryId: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
  seoSlug: "",
  imageAltText: "",
  productVideo: "",
  variantTitle: "Default",
  variantSku: "",
  price: 0,
  compareAtPrice: "",
  stockQuantity: 0,
  variants: [{ ...emptyVariantForm }],
  galleryImages: [],
};
