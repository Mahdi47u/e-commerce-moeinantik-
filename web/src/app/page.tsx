"use client";

import Link from "next/link";
import { ArrowLeft, Layers3, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { BRAND_HERO_IMAGE_URL } from "@/lib/brandAssets";
import { getHomepage } from "@/services/contentService";
import type { Homepage } from "@/types/content";

export default function Home() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);

  useEffect(() => {
    let mounted = true;
    getHomepage()
      .then((nextHomepage) => {
        if (mounted) {
          setHomepage(nextHomepage);
        }
      })
      .catch(() => {
        if (mounted) {
          setHomepage(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const hero = useMemo(() => homepage?.sections.find((section) => section.type === "HERO"), [homepage]);
  const story = useMemo(() => homepage?.sections.find((section) => section.type === "STORY"), [homepage]);
  const featuredProducts = homepage?.featuredProducts || [];
  const categories = homepage?.categories || [];

  return (
    <SiteShell>
      <section className="border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--background))_100%)]">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Moein Antik
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {hero?.title || "گالری دکور و آنتیک برای خانه های خاص"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {hero?.subtitle || "معین آنتیک برای نمایش و فروش قطعات خاص، کلکسیونی و دکوراتیو ساخته شده است."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={hero?.ctaHref || "/products"}>
                  {hero?.ctaLabel || "مشاهده محصولات"}
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/pages/about">درباره گالری</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <HeroNote title="انتخاب دقیق" text="تمرکز روی قطعات خاص و خوش ساخت" />
              <HeroNote title="چیدمان اصیل" text="مناسب خانه، ویلا و فضای کلکسیونی" />
              <HeroNote title="خرید مستقیم" text="اتصال به سبد، سفارش و پرداخت" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-md border border-luxury-gold/40" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-md border border-border bg-card shadow-soft">
              <div className="relative aspect-[4/5] min-h-[420px]">
                <img
                  src={BRAND_HERO_IMAGE_URL}
                  alt="قطعه دکوراتیو آنتیک معین آنتیک"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-6">
                  <p className="max-w-sm text-sm leading-7 text-foreground">
                    {story?.subtitle || "هر قطعه برای ساختن فضایی گرم، شخصی و ماندگار انتخاب می شود."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-14">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="منتخب گالری"
              title="محصولات شاخص"
              description="چند قطعه منتخب برای شروع کشف گالری، با تصویر، قیمت و مسیر مستقیم به صفحه محصول."
            />
            <Button asChild variant="secondary">
              <Link href="/products">همه محصولات</Link>
            </Button>
          </div>

          {featuredProducts.length ? (
            <div className="mt-9 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <HomeEmptyState
              title="هنوز محصول شاخصی برای نمایش نیست"
              description="بعد از فعال کردن محصولات ویژه در پنل مدیریت، این بخش به شکل خودکار پر می شود."
              actionLabel="مشاهده محصولات"
              actionHref="/products"
            />
          )}
        </div>
      </section>

      <section className="container py-14">
        <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
          <SectionHeading
            eyebrow="دسته بندی ها"
            title="مسیر سریع برای کشف محصولات"
            description="از مسیرهای اصلی فروشگاه وارد شوید و قطعات نزدیک به سلیقه خودتان را سریع تر پیدا کنید."
          />

          {categories.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 9).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group flex min-h-24 items-center justify-between rounded-md border border-border bg-card px-4 py-4 text-sm font-medium text-foreground transition hover:bg-secondary/50"
                >
                  <span>{category.name}</span>
                  <Layers3 className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <HomeEmptyState
              title="دسته بندی فعالی ثبت نشده است"
              description="وقتی دسته بندی ها از پنل مدیریت فعال شوند، این بخش به فهرست سریع فروشگاه تبدیل می شود."
              actionLabel="رفتن به فروشگاه"
              actionHref="/products"
            />
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function HeroNote({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-border pt-3">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 leading-6">{text}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold leading-9 text-foreground sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function HomeEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="mt-8 rounded-md border border-border bg-background/60 p-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      <Button asChild variant="secondary" className="mt-5">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
