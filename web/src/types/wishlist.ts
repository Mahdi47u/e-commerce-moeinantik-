import type { Product } from "@/types/catalog";

export type WishlistItem = {
  id: number;
  createdAt: string;
  product: Product;
};
