"use client";

import SiteShell from "@/components/layout/SiteShell";
import { CatalogFilters } from "@/features/catalog/components/CatalogFilters";
import { CatalogHero } from "@/features/catalog/components/CatalogHero";
import { CatalogToolbar } from "@/features/catalog/components/CatalogToolbar";
import { ProductGrid } from "@/features/catalog/components/ProductGrid";
import { useCatalogData } from "@/features/catalog/useCatalogData";

export default function CatalogPageClient() {
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    flatCategories,
    activeCategory,
    visibleProducts,
    loading,
    error,
  } = useCatalogData();

  return (
    <SiteShell>
      <CatalogHero query={query} onQueryChange={setQuery} />

      <section className="container grid gap-8 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CatalogFilters
          categories={flatCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div>
          <CatalogToolbar activeCategory={activeCategory} loading={loading} visibleCount={visibleProducts.length} />
          <ProductGrid products={visibleProducts} loading={loading} error={error} hasQuery={Boolean(query.trim())} />
        </div>
      </section>
    </SiteShell>
  );
}
