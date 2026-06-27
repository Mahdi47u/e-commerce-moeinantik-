"use client";

import Link from "next/link";
import { Grid2X2, Heart, Home, Search, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account", label: "حساب کاربری", icon: UserRound },
  { href: "/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/", label: "خانه", icon: Home, primary: true },
  { href: "/products", label: "دسته‌بندی‌ها", icon: Grid2X2 },
  { href: "/products", label: "جستجو", icon: Search },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 rounded-[1.35rem] border border-border/85 bg-card/96 px-3 py-2 shadow-[0_18px_45px_-24px_rgba(33,30,26,0.65)] backdrop-blur md:hidden"
      aria-label="ناوبری موبایل"
      dir="rtl"
    >
      <div className="grid grid-cols-5 items-end gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "grid min-h-[52px] place-items-center gap-1 rounded-md text-[10px] font-medium text-muted-foreground transition hover:text-primary",
                active && "text-primary",
                item.primary && "-mt-5"
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-md",
                  item.primary ? "h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-[0_10px_22px_-12px_rgba(33,30,26,0.75)]" : "text-current"
                )}
              >
                <Icon className={cn(item.primary ? "h-5 w-5" : "h-[18px] w-[18px]")} aria-hidden="true" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
