import { Filter } from "lucide-react";
import type { FlatCategory } from "@/features/catalog/types";

type CatalogFiltersProps = {
  categories: FlatCategory[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
};

export function CatalogFilters({ categories, selectedCategory, onSelectCategory }: CatalogFiltersProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-md border border-border bg-card p-4 shadow-[0_16px_38px_-34px_rgba(33,30,26,0.6)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
            دسته‌بندی
          </div>
          {selectedCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory("")}
              className="text-xs font-semibold text-primary hover:text-foreground"
            >
              حذف فیلتر
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 lg:block lg:space-y-2">
          <CategoryButton active={!selectedCategory} onClick={() => onSelectCategory("")}>
            همه محصولات
          </CategoryButton>
          {categories.map((category) => (
            <CategoryButton
              key={category.slug}
              active={selectedCategory === category.slug}
              onClick={() => onSelectCategory(category.slug)}
              depth={category.depth}
            >
              {category.name}
            </CategoryButton>
          ))}
        </div>
      </div>
    </aside>
  );
}

function CategoryButton({
  active,
  onClick,
  children,
  depth = 0,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  depth?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ paddingInlineStart: `${12 + depth * 12}px` }}
      className={
        active
          ? "rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground lg:w-full lg:text-right"
          : "rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary/10 lg:w-full lg:text-right"
      }
    >
      {children}
    </button>
  );
}
