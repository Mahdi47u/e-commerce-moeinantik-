import Link from "next/link";
import { Archive, Armchair, Box, Gift, Lamp, Layers3, Sofa } from "lucide-react";
import type { Homepage } from "@/types/content";

const homepageCategories = [
  { label: "جدیدترین‌ها", href: "/products?sort=newest", icon: Archive },
  { label: "هدیه و خاص", href: "/products?category=gifts", icon: Gift },
  { label: "اکسسوری", href: "/products?category=accessories", icon: Box },
  { label: "نورپردازی", href: "/products?category=lighting", icon: Lamp },
  { label: "دکوراسیون", href: "/products?category=decoration", icon: Armchair },
  { label: "مبلمان", href: "/products?category=furniture", icon: Sofa },
  { label: "میز و کنسول", href: "/products?category=table-console", icon: Layers3 },
];

export function CategoryRail({ categories: _categories }: { categories: Homepage["categories"] }) {
  return (
    <section className="px-3 py-2 md:moein-home-frame md:py-5">
      <div className="flex gap-2 overflow-x-auto rounded-[1rem] border border-border bg-card p-2 shadow-[0_10px_24px_-24px_rgba(33,30,26,0.5)] md:grid md:overflow-hidden md:rounded-md md:px-2 md:py-2 md:grid-cols-4 lg:grid-cols-7">
        {homepageCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.label}
              href={category.href}
              className="group grid min-h-[72px] min-w-[76px] place-items-center rounded-md border border-border/70 bg-background px-2 py-2 text-center transition hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:min-h-[66px] md:min-w-0 md:border-0 md:bg-transparent"
            >
              <Icon className="h-6 w-6 stroke-[1.35] text-primary/85 transition group-hover:text-primary md:h-7 md:w-7 md:text-muted-foreground" aria-hidden="true" />
              <span className="mt-1.5 text-[10px] font-medium leading-4 text-foreground md:mt-2 md:text-sm">{category.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
