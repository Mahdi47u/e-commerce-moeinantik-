import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const promoCards = [
  {
    title: "کالکشن بهار",
    description: "آینه، مجسمه و قطعات طلایی برای چیدمان روشن‌تر.",
    href: "/products?category=decoration",
    image: "/images/home/gold-mirror-clock-wall.jpg",
  },
  {
    title: "هدیه‌های خاص",
    description: "ظروف پذیرایی و اکسسوری‌های ماندگار برای خانه‌های خاص.",
    href: "/products?category=gifts",
    image: "/images/home/gold-serving-set.jpg",
  },
];

export function CollectionBanner() {
  return (
    <section className="moein-home-frame py-3 md:py-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {promoCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            dir="rtl"
            className="group relative block min-h-[178px] overflow-hidden rounded-md bg-card text-right shadow-[0_18px_45px_-34px_rgba(33,30,26,0.58)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-[210px]"
          >
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-300 ease-out group-hover:scale-[1.035]"
            />
            <span
              className="absolute inset-0 bg-gradient-to-l from-[rgba(30,38,24,0.84)] via-[rgba(30,38,24,0.5)] to-transparent"
              aria-hidden="true"
            />
            <span className="relative z-10 flex h-full min-h-[178px] max-w-[24rem] flex-col items-start justify-center p-5 text-right text-primary-foreground sm:min-h-[210px] sm:p-7">
              <span className="text-2xl font-semibold leading-9 sm:text-3xl">{card.title}</span>
              <span className="mt-2 text-sm font-medium leading-7 text-primary-foreground/88">{card.description}</span>
              <span className="mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-md bg-card/92 px-5 text-sm font-semibold text-accent transition group-hover:bg-primary group-hover:text-primary-foreground">
                مشاهده
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
