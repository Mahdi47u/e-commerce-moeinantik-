import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { BRAND_HERO_IMAGE_URL } from "@/lib/brandAssets";

export function RoomIdeas() {
  return (
    <section className="moein-home-frame grid gap-6 py-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
        <RoomIdea title="اتاق نشیمن" />
        <RoomIdea title="ناهارخوری" />
        <RoomIdea title="کنسول و ورودی" />
      </div>
      <div className="max-w-[26rem]">
        <SectionHeading
          title="ایده‌هایی برای خانه شما"
          description="هماهنگی و الهام برای فضاهای خاص، با قطعاتی که خریدشان ساده و مطمئن است."
          size="compact"
        />
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/products">
            مشاهده ایده‌ها
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function RoomIdea({ title }: { title: string }) {
  return (
    <Link
      href="/products"
    className="group relative min-h-40 min-w-[72vw] overflow-hidden rounded-md border border-border bg-cover bg-center sm:min-h-44 sm:min-w-0"
      style={{ backgroundImage: `url("${BRAND_HERO_IMAGE_URL}")` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/72 via-foreground/18 to-transparent transition group-hover:from-foreground/82" />
      <span className="absolute inset-x-4 bottom-4 text-base font-semibold text-primary-foreground">{title}</span>
    </Link>
  );
}
