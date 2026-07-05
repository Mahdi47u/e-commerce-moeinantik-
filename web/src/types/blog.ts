export type BlogCategory = {
  id: number;
  createdAt: string;
  name: string;
  slug: string;
  description?: string | null;
  active: boolean;
  sortOrder: number;
};

export type BlogPost = {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  category?: BlogCategory | null;
  authorName?: string | null;
  published: boolean;
  publishedAt?: string | null;
  featured: boolean;
  readingMinutes: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type BlogCategoryPayload = {
  name: string;
  slug?: string;
  description?: string;
  active: boolean;
  sortOrder: number;
};

export type BlogPostPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  categoryId?: number | null;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
