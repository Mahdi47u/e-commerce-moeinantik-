"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type HeroSectionProps = {
  ctaHref?: string;
};

const heroSlides = [
  {
    image: "/images/home/decorative-figures.jpg",
    alt: "مجسمه های دکوراتیو معین آنتیک برای چیدمان خانه",
    title: "خانه را با یک اثر ماندگار شروع کنید",
    description: "آینه، مجسمه، ساعت و اکسسوری های خاص برای فضاهایی که قرار است دیده شوند و به یاد بمانند.",
  },
  {
    image: "/images/home/wooden-gazelles-living-room.jpg",
    alt: "مجسمه های چوبی غزال در فضای نشیمن لوکس",
    title: "چیدمانی که نگاه را نگه می دارد",
    description: "قطعات شاخص برای نشیمن، ورودی و فضاهای پذیرایی که به خانه شخصیت می دهند.",
  },
  {
    image: "/images/home/gold-serving-set.jpg",
    alt: "ست پذیرایی طلایی برای میز لوکس",
    title: "جزئیاتی برای پذیرایی متفاوت",
    description: "انتخاب هایی درخشان برای میز، کنسول و لحظه هایی که باید خاص تر دیده شوند.",
  },
];

export function HeroSection({ ctaHref }: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPreviousSlide = () => {
    setActiveSlide((current) => (current === 0 ? heroSlides.length - 1 : current - 1));
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  return (
    <section
      className="relative isolate overflow-hidden border-b border-border/70 bg-background px-3 pb-5 pt-3 sm:px-5 md:px-8 md:pb-8 lg:min-h-[calc(100svh-86px)] lg:px-10 lg:pt-8"
      aria-labelledby="home-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_14%_78%,oklch(0.88_0.034_80)_0,transparent_30%),radial-gradient(circle_at_88%_8%,oklch(0.92_0.028_74)_0,transparent_31%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--background))_42%,hsl(var(--muted)))]" />
      <div className="pointer-events-none absolute -right-20 top-[-8rem] -z-10 h-96 w-[34rem] rotate-[-16deg] rounded-[50%] bg-primary/10 blur-sm" />
      <div className="pointer-events-none absolute -bottom-28 left-[-9rem] -z-10 h-[28rem] w-[42rem] rotate-[-14deg] rounded-[50%] bg-accent/10 blur-sm" />

      <div className="mx-auto flex min-h-[calc(100svh-118px)] w-full max-w-[1560px] flex-col justify-center gap-5 lg:min-h-[calc(100svh-154px)]">
        <div className="relative mx-auto w-full max-w-[1360px]">
          <div className="absolute left-[11%] top-[58%] hidden h-48 w-48 rounded-full bg-primary/24 shadow-[0_22px_54px_-28px_rgba(33,30,26,0.45)] md:block" />

          <div className="relative grid min-h-[620px] overflow-hidden rounded-lg border border-border bg-card shadow-[0_30px_70px_-42px_rgba(33,30,26,0.62)] md:min-h-[570px] lg:grid-cols-[0.96fr_1.04fr] xl:min-h-[610px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,hsl(var(--secondary))_0,transparent_22%),radial-gradient(circle_at_74%_52%,oklch(0.9_0.036_122)_0,transparent_17%),linear-gradient(110deg,transparent_0%,hsl(var(--card)/0.72)_45%,transparent_74%)]" />
            <div className="pointer-events-none absolute -left-12 top-5 h-40 w-40 rounded-full border border-primary/35 opacity-60" />
            <div className="pointer-events-none absolute left-20 top-8 h-32 w-32 rounded-full border border-primary/25 opacity-55" />
            <div className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full border border-accent/25 opacity-55" />

            <div className="relative z-10 flex flex-col justify-center px-6 py-10 text-right sm:px-10 md:px-14 lg:px-20 xl:px-24" dir="rtl">
              <h1
                id="home-hero-title"
                className="moein-hero-display max-w-[10.5em] text-[2.45rem] font-semibold leading-[1.3] text-foreground sm:text-[3.3rem] lg:text-[3.85rem] xl:text-[4.15rem]"
              >
                {slide.title}
              </h1>
              <p className="mt-6 max-w-[38rem] text-base leading-8 text-muted-foreground sm:text-lg xl:text-xl xl:leading-9">{slide.description}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={ctaHref || "/products"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-[0_18px_34px_-24px_rgba(33,30,26,0.75)] transition hover:bg-accent/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  مشاهده محصولات
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#home-content"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-card/82 px-5 text-sm font-semibold text-accent transition hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  دیدن سایت
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-2" aria-label="اسلایدهای بنر">
                {heroSlides.map((heroSlide, index) => (
                  <button
                    key={heroSlide.image}
                    type="button"
                    className={`h-2.5 rounded-full transition ${
                      index === activeSlide ? "w-8 bg-accent" : "w-2.5 bg-border hover:bg-primary/60"
                    }`}
                    aria-label={`نمایش اسلاید ${index + 1}`}
                    aria-current={index === activeSlide ? "true" : undefined}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 min-h-[330px] overflow-hidden bg-muted md:min-h-[390px] lg:min-h-full">
              {heroSlides.map((heroSlide, index) => (
                <img
                  key={heroSlide.image}
                  src={heroSlide.image}
                  alt={heroSlide.alt}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-out ${
                    index === activeSlide ? "opacity-100" : "opacity-0"
                  }`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ))}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--card))_0%,hsl(var(--card)/0.84)_14%,transparent_45%),linear-gradient(0deg,rgba(33,30,26,0.2),transparent_48%)] lg:bg-[linear-gradient(90deg,hsl(var(--card))_0%,hsl(var(--card)/0.72)_22%,transparent_56%)]" />

              <div className="absolute bottom-5 left-5 flex items-center gap-2" dir="ltr">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/86 text-foreground shadow-[0_12px_28px_-20px_rgba(33,30,26,0.7)] transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="اسلاید قبلی"
                  onClick={goToPreviousSlide}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/86 text-foreground shadow-[0_12px_28px_-20px_rgba(33,30,26,0.7)] transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="اسلاید بعدی"
                  onClick={goToNextSlide}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="#home-content"
          className="group mx-auto hidden items-center gap-2 text-xs font-semibold text-accent transition hover:text-foreground lg:inline-flex"
        >
          اسکرول کنید و ادامه فروشگاه را ببینید
          <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/78 transition group-hover:translate-y-0.5">
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}
