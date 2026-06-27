import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_HERO_IMAGE_URL } from "@/lib/brandAssets";

export function CollectionBanner() {
  return (
    <section className="moein-home-frame py-3 md:py-4">
      <div className="relative grid min-h-64 overflow-hidden rounded-md border border-border bg-accent md:min-h-56 md:grid-cols-[0.9fr_1.1fr]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 md:static md:min-h-56 md:opacity-100"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(47, 58, 38, 0.16), transparent), url("${BRAND_HERO_IMAGE_URL}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/82 to-accent/38 md:hidden" />
        <div className="relative z-10 flex flex-col justify-end p-5 text-accent-foreground md:order-first md:justify-center md:p-8">
          <h2 className="text-2xl font-semibold md:text-3xl">کالکشن جدید بهار</h2>
          <p className="mt-2.5 max-w-[28rem] text-sm leading-7 text-accent-foreground/85 md:mt-3">
            ترکیبی از متریال‌های طبیعی و طراحی ماندگار برای خانه‌های خاص.
          </p>
          <Button asChild variant="outline" className="mt-5 w-fit border-accent-foreground/45 bg-transparent text-accent-foreground hover:bg-accent-foreground/10 md:mt-6">
            <Link href="/products">
              مشاهده کالکشن
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
