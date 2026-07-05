import Image from "next/image";
import Link from "next/link";
import type { Homepage } from "@/types/content";

const homepageCategories = [
  {
    label: "جدیدترین‌ها",
    href: "/products?sort=newest",
    image: "/images/home/orange-wall-clock.jpg",
  },
  {
    label: "هدیه و خاص",
    href: "/products?category=gifts",
    image: "/images/home/gold-serving-set.jpg",
  },
  {
    label: "اکسسوری",
    href: "/products?category=accessories",
    image: "/images/home/decorative-figures.jpg",
  },
  {
    label: "نورپردازی",
    href: "/products?category=lighting",
    image: "/images/home/gold-mirror-clock-wall.jpg",
  },
  {
    label: "دکوراسیون",
    href: "/products?category=decoration",
    image: "/images/home/black-face-wall-art.jpg",
  },
  {
    label: "مبلمان",
    href: "/products?category=furniture",
    image: "/images/home/single-gazelle-living-room.jpg",
  },
  {
    label: "میز و کنسول",
    href: "/products?category=table-console",
    image: "/images/home/wooden-gazelles-living-room.jpg",
  },
];

export function CategoryRail({ categories: _categories }: { categories: Homepage["categories"] }) {
  return (
    <section className="py-10 md:py-14">
      <div className="moein-home-frame">
        <h2 className="text-center text-2xl font-semibold leading-9 text-foreground md:text-3xl">
          خرید بر اساس دسته‌بندی
        </h2>

        <div className="mt-8 flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-10 md:overflow-visible md:pb-0 lg:grid-cols-7">
          {homepageCategories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="group flex min-w-[116px] flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background md:min-w-0"
            >
              <span className="relative grid h-[104px] w-[104px] place-items-center rounded-full border border-border/70 bg-secondary/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-200 ease-out group-hover:border-primary/45 group-hover:bg-card group-hover:shadow-[0_18px_36px_-28px_rgba(33,30,26,0.55)] sm:h-[124px] sm:w-[124px] lg:h-[132px] lg:w-[132px]">
                <span className="absolute inset-1 rounded-full border border-card/80" aria-hidden="true" />
                <Image
                  src={category.image}
                  alt=""
                  width={164}
                  height={164}
                  sizes="(min-width: 1024px) 132px, (min-width: 640px) 124px, 104px"
                  className="h-[86px] w-[86px] rounded-full object-cover transition duration-200 ease-out group-hover:scale-[1.04] sm:h-[104px] sm:w-[104px] lg:h-[112px] lg:w-[112px]"
                />
              </span>
              <span className="mt-4 max-w-[9rem] text-sm font-semibold leading-7 text-foreground transition group-hover:text-primary md:text-base">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
