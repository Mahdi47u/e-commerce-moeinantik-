"use client";

import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts } from "@/services/catalogService";
import type { Product, Category } from "@/types/catalog";
import type { FlatCategory } from "@/features/catalog/types";

export function useCatalogData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return new URLSearchParams(window.location.search).get("category") || "";
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    Promise.all([getProducts(selectedCategory || undefined), getCategories()])
      .then(([nextProducts, nextCategories]) => {
        if (!mounted) {
          return;
        }
        setProducts(nextProducts);
        setCategories(nextCategories);
      })
      .catch((error) => {
        if (mounted) {
          setError(error instanceof Error ? error.message : "دریافت محصولات ناموفق بود.");
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
  }, [selectedCategory]);

  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);
  const activeCategory = useMemo(
    () => flatCategories.find((category) => category.slug === selectedCategory),
    [flatCategories, selectedCategory]
  );
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.shortDescription, product.categoryName]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery))
    );
  }, [products, query]);

  return {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    flatCategories,
    activeCategory,
    visibleProducts,
    loading,
    error,
  };
}

function flattenCategories(categories: Category[], depth = 0): FlatCategory[] {
  return categories.flatMap((category) => [
    { ...category, depth },
    ...flattenCategories(category.children || [], depth + 1),
  ]);
}
