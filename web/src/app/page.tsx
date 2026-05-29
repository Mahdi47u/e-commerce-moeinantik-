import Link from "next/link";
import AuthStatus from "@/components/layout/AuthStatus";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="container flex items-center justify-between py-5">
        <Link href="/" className="text-lg font-semibold text-foreground">
          معین آنتیک
        </Link>
        <AuthStatus />
      </header>
      <section className="container grid min-h-screen items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_520px]">
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

        <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
          <div className="aspect-[4/5] rounded-md bg-[linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--card)))]" />
        </div>
      </section>
    </main>
  );
}
