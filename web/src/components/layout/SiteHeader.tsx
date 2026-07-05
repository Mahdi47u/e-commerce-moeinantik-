"use client";

import Link from "next/link";
import { Heart, Search, ShieldCheck, ShoppingBag, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import MobileMenu from "@/components/layout/MobileMenu";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { isAdminUser } from "@/lib/authRoles";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";

const showroomNav = [
  { href: "/products?sort=newest", label: "جدیدترین‌ها" },
  { href: "/products?category=table-console", label: "میز و کنسول" },
  { href: "/products?category=furniture", label: "مبلمان" },
  { href: "/products?category=decoration", label: "دکوراسیون" },
  { href: "/products?category=lighting", label: "نورپردازی" },
  { href: "/products?category=gifts", label: "هدیه و خاص" },
  { href: "/blog", label: "مجله" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const showAdmin = isAdminUser(user);

  return (
    <header className="sticky top-0 z-30 border-b border-border/75 bg-card/95 shadow-[0_12px_28px_-28px_rgba(33,30,26,0.5)] backdrop-blur">
      <div className="relative flex h-[76px] items-center justify-between px-4 md:hidden" dir="ltr">
        <CartLink />

        <Link href="/" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center" aria-label="معین آنتیک">
          <img
            src={BRAND_LOGO_URL}
            alt="معین آنتیک"
            width={945}
            height={573}
            className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
            style={{ width: "auto", maxWidth: "132px" }}
          />
        </Link>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mx-auto grid min-h-[70px] w-full max-w-[1640px] grid-cols-[minmax(0,1fr)_minmax(360px,660px)_minmax(0,1fr)] items-center gap-4 px-8 py-1.5 xl:px-12" dir="ltr">
          <div className="flex items-center justify-start gap-3">
            <ThemeToggle />
            <CartLink />
            <IconLink href="/wishlist" label="علاقه‌مندی‌ها">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </IconLink>
            <IconLink href={user ? "/account" : "/login"} label={user ? "حساب کاربری" : "ورود به حساب کاربری"}>
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </IconLink>
          </div>

          <label className="group mx-auto flex h-11 w-full max-w-[660px] items-center gap-3 rounded-md border border-primary/25 bg-background/80 px-4 transition duration-200 focus-within:border-primary/60 focus-within:bg-card" dir="rtl">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground transition group-focus-within:text-primary" aria-hidden="true" />
            <span className="sr-only">جستجو در محصولات</span>
            <input
              placeholder="جستجو در محصولات..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/90"
            />
          </label>

          <Link href="/" className="flex items-center justify-end" aria-label="معین آنتیک">
            <img
              src={BRAND_LOGO_URL}
              alt="معین آنتیک"
              width={945}
              height={573}
              className="h-14 w-auto object-contain dark:brightness-0 dark:invert"
              style={{ width: "auto", maxWidth: "184px" }}
            />
          </Link>
        </div>

        <div className="mx-auto grid h-12 w-full max-w-[1640px] grid-cols-[160px_1fr_160px] items-center gap-4 px-8 xl:px-12" dir="ltr">
          <Link
            href="/products?featured=true"
            className="justify-self-start rounded-sm border border-primary/35 bg-card px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            پیشنهاد ویژه
          </Link>

          <nav className="flex min-w-0 items-center justify-center gap-4" aria-label="منوی اصلی" dir="rtl">
            {showroomNav.map((link) => (
              <HeaderLink key={link.href} href={link.href} active={pathname === link.href.split("?")[0]}>
                {link.label}
              </HeaderLink>
            ))}

            {showAdmin && (
              <HeaderLink href="/admin/dashboard" active={pathname.startsWith("/admin")}>
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                داشبورد
              </HeaderLink>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-sm px-3 text-sm font-medium transition",
        active ? "bg-secondary/65 text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

function CartLink() {
  return (
    <Link
      href="/cart"
      className="relative grid h-10 w-10 place-items-center rounded-sm text-foreground transition hover:bg-secondary/55 hover:text-primary"
      aria-label="سبد خرید"
      title="سبد خرید"
    >
      <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
      <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-primary-foreground">
        ۲
      </span>
    </Link>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="grid h-10 w-10 place-items-center rounded-sm text-foreground transition hover:bg-secondary/55 hover:text-primary"
      aria-label={label}
      title={label}
    >
      {children}
    </Link>
  );
}
