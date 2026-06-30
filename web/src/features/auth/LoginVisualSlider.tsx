"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/images/home/reference-hero-banner-20260627.jpg",
    alt: "چیدمان لوکس خانه با اکسسوری‌های معین آنتیک",
    title: "خانه‌ای با جزئیات ماندگار",
    description: "وارد حساب خود شوید و سفارش‌ها، علاقه‌مندی‌ها و انتخاب‌های خاص خود را دنبال کنید.",
  },
  {
    image: "/images/home/gold-serving-set.jpg",
    alt: "ست پذیرایی طلایی معین آنتیک روی میز",
    title: "انتخاب‌هایی برای پذیرایی خاص",
    description: "کالاهای محبوب خود را ذخیره کنید و خریدهای بعدی را دقیق‌تر ادامه دهید.",
  },
  {
    image: "/images/home/gold-mirror-clock-wall.jpg",
    alt: "ساعت و آینه دکوراتیو طلایی در فضای نشیمن",
    title: "زیبایی در هر گوشه خانه",
    description: "از حساب کاربری، وضعیت سفارش‌ها و مسیر ارسال را ساده و سریع ببینید.",
  },
];

export default function LoginVisualSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % slides.length);
  }

  return (
    <section className="relative hidden min-h-[620px] overflow-hidden lg:block" aria-label="تصاویر معین آنتیک">
      {slides.map((slide, index) => {
        const active = index === activeIndex;

        return (
          <div
            key={slide.image}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              active ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={!active}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="55vw"
              className="object-cover"
            />
          </div>
        );
      })}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(33,30,26,0.05)_0%,rgba(33,30,26,0.48)_100%)]" />

      <div className="absolute bottom-0 left-0 right-0 p-10 text-right text-primary-foreground" dir="rtl">
        <p className="max-w-md text-4xl font-semibold leading-tight">
          {slides[activeIndex].title}
        </p>
        <p className="mt-4 max-w-md text-sm leading-7 text-primary-foreground/85">
          {slides[activeIndex].description}
        </p>
      </div>

      <div className="absolute bottom-10 left-10 flex items-center gap-2" dir="ltr">
        <button
          type="button"
          onClick={showPrevious}
          className="grid h-10 w-10 place-items-center rounded-md border border-primary-foreground/45 bg-primary-foreground/10 text-primary-foreground transition hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/80"
          aria-label="تصویر قبلی"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={showNext}
          className="grid h-10 w-10 place-items-center rounded-md border border-primary-foreground/45 bg-primary-foreground/10 text-primary-foreground transition hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/80"
          aria-label="تصویر بعدی"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="absolute left-1/2 top-6 flex -translate-x-1/2 gap-2" dir="ltr">
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 rounded-full transition-[width,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/80",
              index === activeIndex ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/55"
            )}
            aria-label={`نمایش تصویر ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
}
