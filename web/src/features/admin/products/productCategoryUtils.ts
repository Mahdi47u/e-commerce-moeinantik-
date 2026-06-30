import type { Category } from "@/types/catalog";

export function flattenProductCategories(categories: Category[], depth = 0): Array<{ category: Category; depth: number }> {
  return categories.flatMap((category) => [{ category, depth }, ...flattenProductCategories(category.children || [], depth + 1)]);
}

