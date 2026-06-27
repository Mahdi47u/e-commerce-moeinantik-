"use client";

import { useEffect, useMemo, useState } from "react";
import { getHomepage } from "@/services/contentService";
import type { Homepage } from "@/types/content";

export function useHomepageData() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getHomepage()
      .then((nextHomepage) => {
        if (mounted) {
          setHomepage(nextHomepage);
          setError("");
        }
      })
      .catch((error) => {
        if (mounted) {
          setHomepage(null);
          setError(error instanceof Error ? error.message : "دریافت اطلاعات صفحه اصلی ناموفق بود.");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const hero = useMemo(() => homepage?.sections.find((section) => section.type === "HERO"), [homepage]);
  const featuredProducts = homepage?.featuredProducts || [];
  const categories = homepage?.categories || [];
  const newestProducts = featuredProducts.slice(0, 4).reverse();

  return {
    homepage,
    hero,
    featuredProducts,
    categories,
    newestProducts,
    error,
  };
}
