"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories } from "@/services/catalogService";
import type { Category } from "@/types/catalog";

export type NavigationCategory = {
  id: number;
  name: string;
  slug: string;
  depth: number;
};

export function useNavigationCategories(limit = 8) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCategories()
      .then((nextCategories) => {
        if (mounted) {
          setCategories(nextCategories);
        }
      })
      .catch(() => {
        if (mounted) {
          setCategories([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(() => flattenCategories(categories).slice(0, limit), [categories, limit]);

  return { categories: items, loading };
}

function flattenCategories(categories: Category[], depth = 0): NavigationCategory[] {
  return categories.flatMap((category) => {
    if (!category.active) {
      return flattenCategories(category.children || [], depth);
    }

    return [
      {
        id: category.id,
        name: category.name,
        slug: category.slug,
        depth,
      },
      ...flattenCategories(category.children || [], depth + 1),
    ];
  });
}
