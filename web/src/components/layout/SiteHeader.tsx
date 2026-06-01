import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import AuthStatus from "@/components/layout/AuthStatus";

export default function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/95">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold text-foreground">
            معین آنتیک
          </Link>
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary">
            محصولات
          </Link>
          <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-primary">
            سفارش‌ها
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground hover:bg-secondary/50"
            aria-label="سبد خرید"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </Link>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
