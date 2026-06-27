import type { Category } from "@/types/catalog";

export type FlatCategory = Category & {
  depth: number;
};
