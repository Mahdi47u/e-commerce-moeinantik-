"use client";

import Link from "next/link";
import { Heart, Menu, PackageCheck, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { adminNavigation, mainNavigation, shopNavigation } from "@/config/siteNavigation";
import { useAuth } from "@/context/AuthContext";
import { useNavigationCategories } from "@/hooks/useNavigationCategories";
import { isAdminUser } from "@/lib/authRoles";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { categories, loading: categoriesLoading } = useNavigationCategories(10);
  const showAdmin = isAdminUser(user);

  function close() {
    setOpen(false);
  }

  function handleLogout() {
    logout();
    close();
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground transition hover:bg-secondary/60"
        aria-label={open ? "بستن منو" : "باز کردن منو"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background shadow-soft">
          <div className="container max-h-[calc(100vh-4rem)] overflow-y-auto py-4">
            <nav aria-label="منوی اصلی موبایل">
              <div className="grid gap-1">
                {mainNavigation.map((link) => (
                  <MobileLink key={link.href} href={link.href} label={link.label} onClick={close} />
                ))}
              </div>
            </nav>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold text-muted-foreground">فروشگاه</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <QuickLink href="/wishlist" label="علاقه‌مندی‌ها" icon={<Heart className="h-4 w-4" />} onClick={close} />
                <QuickLink href="/cart" label="سبد خرید" icon={<ShoppingBag className="h-4 w-4" />} onClick={close} />
                <QuickLink href="/orders" label="سفارش‌ها" icon={<PackageCheck className="h-4 w-4" />} onClick={close} />
                <QuickLink href="/account" label="حساب کاربری" icon={<UserRound className="h-4 w-4" />} onClick={close} />
              </div>
              <div className="mt-3 grid gap-1">
                <MobileLink href="/products" label="همه محصولات" onClick={close} />
                {categoriesLoading && <p className="px-3 py-2 text-sm text-muted-foreground">در حال دریافت دسته‌بندی‌ها...</p>}
                {!categoriesLoading &&
                  categories.map((category) => (
                    <MobileLink
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      label={category.name}
                      onClick={close}
                      inset={category.depth}
                    />
                  ))}
                {!categoriesLoading &&
                  categories.length === 0 &&
                  shopNavigation.slice(1, 3).map((link) => (
                    <MobileLink key={link.href} href={link.href} label={link.label} onClick={close} />
                  ))}
              </div>
            </div>

            {showAdmin && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground">مدیریت</p>
                <div className="mt-2 grid gap-1">
                  {adminNavigation.map((link) => (
                    <MobileLink key={link.href} href={link.href} label={link.label} onClick={close} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 border-t border-border pt-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">در حال بررسی حساب...</p>
              ) : user ? (
                <div className="flex items-center justify-between gap-3">
                  <Link href="/account" onClick={close} className="min-w-0 text-sm font-medium text-foreground">
                    {user.username}
                  </Link>
                  <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>
                    خروج
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="secondary">
                    <Link href="/login" onClick={close}>
                      ورود
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register" onClick={close}>
                      ثبت نام
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileLink({ href, label, onClick, inset = 0 }: NavigationLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/60"
      style={{ paddingInlineStart: `${12 + inset * 14}px` }}
    >
      {label}
    </Link>
  );
}

function QuickLink({ href, label, icon, onClick }: NavigationLinkProps & { icon: ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/60"
    >
      {icon}
      {label}
    </Link>
  );
}

type NavigationLinkProps = {
  href: string;
  label: string;
  onClick: () => void;
  inset?: number;
};
