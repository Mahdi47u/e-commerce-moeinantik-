export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type Category = {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
  active: boolean;
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  children: Category[];
};

export type ProductVariant = {
  id: number;
  title: string;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  active: boolean;
  sortOrder: number;
};

export type ProductGalleryImage = {
  id: number;
  mediaAssetId: number;
  url: string;
  altText?: string | null;
  primaryImage: boolean;
  sortOrder: number;
  width?: number | null;
  height?: number | null;
};

export type ProductAttributeAssignment = {
  id: number;
  attributeId: number;
  attributeName: string;
  attributeSlug: string;
  attributeValueId?: number | null;
  attributeValue?: string | null;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  sortOrder: number;
};

export type Product = {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  variants: ProductVariant[];
  galleryImages: ProductGalleryImage[];
  attributes: ProductAttributeAssignment[];
};
