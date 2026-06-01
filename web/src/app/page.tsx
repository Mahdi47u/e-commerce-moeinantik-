import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_520px]">
        <div>
          <p className="text-sm font-medium text-primary">Moein Antik</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            گالری لوکس دکور و آنتیک برای خانه‌های خاص
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            این پروژه با معماری Spring Boot و Next.js ساخته می‌شود تا فروشگاه معین آنتیک بدون محدودیت وردپرس قابل توسعه باشد.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/admin">ورود به پنل مدیریت</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-4 shadow-soft">
          <div className="flex aspect-[4/5] items-end rounded-md bg-[radial-gradient(circle_at_30%_20%,hsl(var(--luxury-gold)/0.25),transparent_34%),linear-gradient(145deg,hsl(var(--secondary)),hsl(var(--card)))] p-6">
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              نمایشگاه آنلاین محصولات با دسته‌بندی، تصویر، ویژگی و قیمت از فاز ششم فعال می‌شود.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
