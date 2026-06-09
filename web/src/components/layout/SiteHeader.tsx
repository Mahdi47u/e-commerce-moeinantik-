"use client";

import Link from "next/link";
import { Heart, ShieldCheck, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AuthStatus from "@/components/layout/AuthStatus";
import MobileMenu from "@/components/layout/MobileMenu";
import { adminNavigation, mainNavigation, shopNavigation } from "@/config/siteNavigation";
import { useAuth } from "@/context/AuthContext";
import { useNavigationCategories } from "@/hooks/useNavigationCategories";
import { isAdminUser } from "@/lib/authRoles";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { categories, loading: categoriesLoading } = useNavigationCategories(7);
  const showAdmin = isAdminUser(user);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center" aria-label="معین آنتیک">
            <img
              src={BRAND_LOGO_URL}
              alt="معین آنتیک"
              width={180}
              height={109}
              className="h-11 w-auto object-contain"
              style={{ width: "auto", maxWidth: "180px", height: "44px", objectFit: "contain" }}
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="منوی اصلی">
            {mainNavigation.map((link) => (
              <HeaderLink key={link.href} href={link.href} active={isActive(pathname, link.href)}>
                {link.label}
              </HeaderLink>
            ))}

            <div className="group relative">
              <HeaderLink href="/products" active={pathname.startsWith("/products")}>
                دسته بندی ها
              </HeaderLink>
              <div className="invisible absolute right-0 top-full z-20 w-64 translate-y-2 rounded-md border border-border bg-card p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href="/products"
                  className="block rounded-md px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50 hover:text-primary"
                >
                  همه محصولات
                </Link>
                <div className="my-2 border-t border-border" />
                {categoriesLoading && (
                  <span className="block rounded-md px-3 py-2 text-sm text-muted-foreground">در حال دریافت دسته بندی ها...</span>
                )}
                {!categoriesLoading &&
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary/50 hover:text-primary"
                      style={{ paddingInlineStart: `${12 + category.depth * 14}px` }}
                    >
                      {category.name}
                    </Link>
                  ))}
                {!categoriesLoading &&
                  categories.length === 0 &&
                  shopNavigation.slice(1, 4).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary/50 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
              </div>
            </div>

            {showAdmin &&
              adminNavigation.map((link) => (
                <HeaderLink key={link.href} href={link.href} active={pathname.startsWith("/admin")}>
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </HeaderLink>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <IconLink href="/wishlist" label="علاقه مندی ها">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </IconLink>
            <IconLink href="/cart" label="سبد خرید">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </IconLink>
            <AuthStatus />
          </div>
          <MobileMenu />
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
        "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition",
        active ? "bg-secondary/60 text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground transition hover:bg-secondary/50 hover:text-primary"
      aria-label={label}
      title={label}
    >
      {children}
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href;
}
