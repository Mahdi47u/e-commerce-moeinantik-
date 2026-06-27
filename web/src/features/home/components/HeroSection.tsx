"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import type { ReactNode } from "react";

type HeroSectionProps = {
  ctaHref?: string;
};

const desktopHeroImage = "/images/home/reference-hero-banner-20260627.jpg";
const mobileHeroImage = "/images/home/reference-mobile-hero-20260627.jpg";

export function HeroSection({ ctaHref }: HeroSectionProps) {
  return (
    <section className="w-full border-b border-border/70 bg-background px-3 pb-3 pt-2 md:bg-card md:px-0 md:pb-0 md:pt-0">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-border bg-card shadow-[0_16px_34px_-26px_rgba(33,30,26,0.55)] md:grid md:min-h-0 md:rounded-none md:border-0 md:shadow-none lg:h-[348px] lg:grid-cols-[minmax(0,1.42fr)_minmax(420px,0.78fr)] 2xl:h-[388px] 2xl:grid-cols-[minmax(0,1.55fr)_minmax(460px,0.72fr)]" dir="ltr">
        <div className="relative h-[326px] overflow-hidden sm:h-[380px] lg:h-full">
          <picture>
            <source media="(max-width: 767px)" srcSet={mobileHeroImage} />
            <img
              src={desktopHeroImage}
              alt="چیدمان لوکس کنسول، آباژور و آینه معین آنتیک"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,30,26,0)_32%,rgba(33,30,26,0.34)_66%,rgba(33,30,26,0.72)_100%)] md:hidden" />
          <div className="absolute inset-y-0 right-0 hidden w-48 bg-gradient-to-l from-card via-card/80 to-transparent lg:block 2xl:w-64" />

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:hidden" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-card" />
            <span className="h-1.5 w-1.5 rounded-full border border-card/80" />
            <span className="h-1.5 w-1.5 rounded-full border border-card/80" />
            <span className="h-1.5 w-1.5 rounded-full border border-card/80" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-5 md:relative md:inset-auto md:flex md:items-center md:justify-start md:px-10 md:py-7 xl:px-14" dir="rtl">
          <div className="w-full max-w-[500px] text-center md:text-right">
            <h1 className="mx-auto max-w-[12em] text-[1.55rem] font-semibold leading-[1.55] text-primary-foreground drop-shadow-[0_2px_16px_rgba(33,30,26,0.55)] md:mx-0 md:max-w-none md:text-[2.35rem] md:text-foreground md:drop-shadow-none 2xl:text-[2.55rem]">
              زیبایی در جزئیات خانه‌ای که به شما می‌آید
            </h1>
            <p className="mt-1.5 hidden text-sm leading-7 text-primary-foreground/90 drop-shadow-[0_2px_12px_rgba(33,30,26,0.45)] sm:block md:text-muted-foreground md:drop-shadow-none">
              منتخب‌ترین آثار دکوراتیو برای فضاهای خاص
            </p>
            <div className="mt-4">
              <Link
                href={ctaHref || "/products"}
                className="inline-flex h-10 min-w-40 items-center justify-center gap-2.5 rounded-md border border-card/35 bg-accent/92 px-5 text-xs font-semibold text-accent-foreground shadow-[0_14px_32px_-18px_rgba(33,30,26,0.75)] transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm md:shadow-none"
              >
                مشاهده محصولات
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 hidden grid-cols-3 gap-2 text-[11px] text-muted-foreground md:grid">
              <HeroPromise icon={<Truck className="h-4 w-4" />} title="ارسال سریع" text="به سراسر کشور" />
              <HeroPromise icon={<ShieldCheck className="h-4 w-4" />} title="ضمانت اصالت" text="کالا" />
              <HeroPromise icon={<RefreshCcw className="h-4 w-4" />} title="۷ روز ضمانت" text="بازگشت وجه" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPromise({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span>
        <span className="block font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block leading-5">{text}</span>
      </span>
    </div>
  );
}
