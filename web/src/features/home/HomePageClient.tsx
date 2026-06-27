"use client";

import SiteShell from "@/components/layout/SiteShell";
import { StatePanel } from "@/components/ui/state-panel";
import { CategoryRail } from "@/features/home/components/CategoryRail";
import { CollectionBanner } from "@/features/home/components/CollectionBanner";
import { HeroSection } from "@/features/home/components/HeroSection";
import { ProductShowcase } from "@/features/home/components/ProductShowcase";
import { RoomIdeas } from "@/features/home/components/RoomIdeas";
import { TrustStrip } from "@/features/home/components/TrustStrip";
import { useHomepageData } from "@/features/home/useHomepageData";

export default function HomePageClient() {
  const { hero, featuredProducts, categories, newestProducts, error } = useHomepageData();

  return (
    <SiteShell>
      <HeroSection ctaHref={hero?.ctaHref || undefined} />
      {error && (
        <section className="container pt-6">
          <StatePanel
            title="محصولات صفحه اصلی دریافت نشد"
            description={error}
            actionLabel="مشاهده همه محصولات"
            actionHref="/products"
          />
        </section>
      )}
      <CategoryRail categories={categories} />

      <ProductShowcase
        title="منتخب این هفته"
        products={featuredProducts.slice(0, 4)}
        emptyTitle="هنوز محصولی برای منتخب این هفته ثبت نشده"
        emptyDescription="با فعال کردن محصولات ویژه، این بخش شبیه ویترین اصلی فروشگاه پر می‌شود."
      />

      <CollectionBanner />

      <ProductShowcase
        title="جدیدترین محصولات"
        products={newestProducts.length ? newestProducts : featuredProducts.slice(0, 4)}
        emptyTitle="هنوز محصول جدیدی برای نمایش نیست"
        emptyDescription="بعد از ثبت محصولات، این بخش به ویترین تازه‌ترین کالاها تبدیل می‌شود."
      />

      <TrustStrip />
      <RoomIdeas />
    </SiteShell>
  );
}
