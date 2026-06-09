import type { Category, Product } from "@/types/catalog";

export type ContentPage = {
  id: number;
  createdAt: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type HomepageSectionType = "HERO" | "FEATURED_PRODUCTS" | "CATEGORY_GRID" | "STORY" | "CUSTOM";

export type HomepageSection = {
  id: number;
  title: string;
  subtitle?: string | null;
  type: HomepageSectionType;
  active: boolean;
  sortOrder: number;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export type Homepage = {
  sections: HomepageSection[];
  featuredProducts: Product[];
  categories: Category[];
  seoTitle: string;
  seoDescription: string;
};
