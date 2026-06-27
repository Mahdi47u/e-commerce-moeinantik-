import { Search } from "lucide-react";
import { TextInput } from "@/components/ui/field";

type CatalogHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function CatalogHero({ query, onQueryChange }: CatalogHeroProps) {
  return (
    <section className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--background))_100%)]">
      <div className="container grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">گالری محصولات</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
            انتخاب قطعات لوکس برای خانه‌هایی که سطح بالاتری می‌خواهند
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            دسته‌بندی را انتخاب کنید، نام محصول را جستجو کنید و سریع به قطعه‌ای برسید که برای خانه، پروژه طراحی داخلی یا هدیه خاص مناسب است.
          </p>
        </div>
        <label className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 shadow-[0_16px_38px_-34px_rgba(33,30,26,0.55)]">
          <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">جستجو در محصولات</span>
          <TextInput
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="جستجو در محصولات"
            className="min-h-9 border-0 bg-transparent px-0 focus:ring-0"
          />
        </label>
      </div>
    </section>
  );
}
