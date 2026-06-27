"use client";

import Link from "next/link";
import {
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  PackageSearch,
  SearchCheck,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "داشبورد",
    description: "فروش، موجودی و وضعیت فروشگاه",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/dashboard/products",
    label: "محصولات",
    description: "کاتالوگ، قیمت و موجودی",
    icon: PackageSearch,
  },
  {
    href: "/admin/dashboard/categories",
    label: "دسته بندی ها",
    description: "ساختار فروشگاه",
    icon: FolderTree,
  },
  {
    href: "/admin/dashboard/orders",
    label: "سفارش ها",
    description: "فروش و ارسال",
    icon: ClipboardList,
  },
  {
    href: "/admin/dashboard/comments",
    label: "دیدگاه ها",
    description: "تایید، پاسخ و گزارش",
    icon: MessageSquareText,
  },
  {
    href: "/admin/dashboard/blog",
    label: "بلاگ",
    description: "دسته ها و نوشته ها",
    icon: Newspaper,
  },
  {
    href: "/admin/dashboard/settings",
    label: "تنظیمات",
    description: "رفتار اپلیکیشن",
    icon: Settings,
  },
  {
    href: "/admin/dashboard/seo",
    label: "سئو",
    description: "پلاگین آینده",
    icon: SearchCheck,
  },
];

export default function AdminShell({
  eyebrow = "پنل مدیریت",
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="container py-8" dir="rtl">
      <div className="rounded-md border border-border bg-card/70 px-5 py-5 shadow-[0_18px_45px_-40px_rgba(33,30,26,0.55)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="rounded-md border border-border bg-card p-2 shadow-[0_16px_38px_-34px_rgba(33,30,26,0.6)]" aria-label="منوی مدیریت">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active =
                link.href === "/admin/dashboard" ? pathname === "/admin" || pathname === "/admin/dashboard" : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-start gap-3 rounded-md px-3 py-3 transition duration-200",
                    active ? "bg-primary/10 text-foreground ring-1 ring-primary/20" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                  )}
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold">{link.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{link.description}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
