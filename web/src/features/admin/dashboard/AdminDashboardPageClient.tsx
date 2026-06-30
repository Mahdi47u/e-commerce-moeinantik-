"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Boxes,
  ChevronDown,
  ClipboardList,
  Eye,
  FolderTree,
  Home,
  MessageSquareText,
  Newspaper,
  PackageCheck,
  PackageSearch,
  RefreshCw,
  Search,
  SearchCheck,
  Settings,
  ShoppingBag,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";
import { StatePanel } from "@/components/ui/state-panel";
import { useAuth } from "@/context/AuthContext";
import { ProductCrudPanel, type ProductEditorTarget } from "@/features/admin/products/ProductCrudPanel";
import { BRAND_LOGO_URL } from "@/lib/brandAssets";
import { cn } from "@/lib/utils";
import { getAdminCategories, getAdminProducts } from "@/services/catalogService";
import { getAdminOrders } from "@/services/orderService";
import type { Category, Product } from "@/types/catalog";
import type { Role } from "@/types/auth";
import type { Order } from "@/types/order";

type DashboardData = {
  orders: Order[];
  products: Product[];
  categories: Category[];
};

export type AdminDashboardTab = "dashboard" | "orders" | "products" | "categories" | "comments" | "blog" | "settings" | "seo";

const revenueSeries = [42, 55, 50, 68, 63, 82, 73, 88];
const orderSeries = [28, 34, 31, 42, 39, 55, 48, 58];

const adminDashboardTabs: Array<{ id: AdminDashboardTab; href: string; label: string; icon: typeof Home }> = [
  { id: "dashboard", href: "/admin/dashboard", label: "داشبورد", icon: Home },
  { id: "orders", href: "/admin/dashboard/orders", label: "سفارش ها", icon: ClipboardList },
  { id: "products", href: "/admin/dashboard/products", label: "محصولات", icon: PackageSearch },
  { id: "categories", href: "/admin/dashboard/categories", label: "دسته بندی ها", icon: FolderTree },
  { id: "comments", href: "/admin/dashboard/comments", label: "دیدگاه ها", icon: MessageSquareText },
  { id: "blog", href: "/admin/dashboard/blog", label: "بلاگ", icon: Newspaper },
  { id: "settings", href: "/admin/dashboard/settings", label: "تنظیمات", icon: Settings },
  { id: "seo", href: "/admin/dashboard/seo", label: "سئو", icon: SearchCheck },
];

export default function AdminDashboardPageClient({
  initialTab = "dashboard",
  productEditor = { mode: "list" },
}: {
  initialTab?: AdminDashboardTab;
  productEditor?: ProductEditorTarget;
}) {
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData>({ orders: [], products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const activeTab = initialTab;

  const canViewDashboard = hasAdminRole(user?.roles || []);
  const activeTabMeta = adminDashboardTabs.find((tab) => tab.id === activeTab) || adminDashboardTabs[0];

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || !canViewDashboard) {
      setLoading(false);
      return;
    }

    loadDashboard();
  }, [authLoading, token, canViewDashboard]);

  const metrics = useMemo(() => buildMetrics(data), [data]);

  async function loadDashboard() {
    if (!token) {
      return;
    }

    setError("");
    setRefreshing(true);
    try {
      const [orders, products, categories] = await Promise.all([getAdminOrders(token), getAdminProducts(token), getAdminCategories(token)]);
      setData({ orders, products, categories });
    } catch (error) {
      setError(error instanceof Error ? error.message : "دریافت داده های داشبورد ناموفق بود.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <div className="min-h-screen bg-secondary/45 p-3 sm:p-5 lg:p-8" dir="rtl">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1680px] overflow-hidden rounded-md border border-border bg-background shadow-[0_26px_70px_-48px_rgba(33,30,26,0.62)] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-card p-4 lg:border-b-0 lg:border-l">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-3" aria-label="داشبورد مدیریت معین آنتیک">
              <img
                src={BRAND_LOGO_URL}
                alt="معین آنتیک"
                width={945}
                height={573}
                className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
                style={{ width: "auto", maxWidth: "136px" }}
              />
            </Link>
            <Button asChild variant="secondary" size="sm" className="lg:mt-5 lg:w-full">
              <Link href="/">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                فروشگاه
              </Link>
            </Button>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible" aria-label="منوی مدیریت">
            {adminDashboardTabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-right text-sm font-semibold transition lg:flex lg:w-full",
                    active ? "bg-primary text-primary-foreground shadow-[0_12px_26px_-20px_rgba(61,45,25,0.7)]" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">پنل مدیریت</p>
              <h1 className="mt-1 text-3xl font-semibold leading-tight text-foreground">{activeTabMeta.label}</h1>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <label className="hidden h-11 min-w-[280px] items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground md:flex xl:min-w-[420px]">
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>جستجو در سفارش، محصول یا مشتری</span>
              </label>
              <ThemeToggle />
              <Button type="button" variant="secondary" size="icon" aria-label="به روزرسانی" onClick={loadDashboard} disabled={refreshing || loading || !canViewDashboard}>
                <RefreshCw className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
              </Button>
              <span className="hidden items-center gap-3 rounded-md bg-card px-3 py-2 sm:inline-flex">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/12 text-primary">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-right">
                  <span className="block text-sm font-semibold text-foreground">{user?.username || "Admin"}</span>
                  <span className="block text-xs text-muted-foreground">مدیر</span>
                </span>
              </span>
            </div>
          </header>

        {!authLoading && !canViewDashboard && <AccessDenied />}
        {loading && canViewDashboard && <DashboardSkeleton />}

        {error && (
          <p className="mb-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        {!loading && canViewDashboard && (
          activeTab === "dashboard" ? (
            <DashboardOverview metrics={metrics} />
          ) : (
            <AdminTabPanel tab={activeTab} data={data} metrics={metrics} token={token} onChanged={loadDashboard} productEditor={productEditor} />
          )
        )}
        </main>
      </div>
    </div>
  );
}

function DashboardOverview({ metrics }: { metrics: ReturnType<typeof buildMetrics> }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="شاخص های کلیدی فروشگاه">
        <MetricCard
          label="فروش کل"
          value={formatPrice(metrics.revenue)}
          helper={`${formatNumber(metrics.paidOrders)} سفارش پرداخت شده`}
          icon={<WalletCards className="h-4 w-4" aria-hidden="true" />}
          className="bg-primary/10"
        />
        <MetricCard
          label="کل سفارش ها"
          value={formatNumber(metrics.orderCount)}
          helper={`${formatNumber(metrics.processingOrders)} سفارش در حال پردازش`}
          icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
          tone="neutral"
        />
        <MetricCard
          label="محصولات فعال"
          value={formatNumber(metrics.activeProducts)}
          helper={`${formatNumber(metrics.lowStockCount)} مورد کم موجودی`}
          icon={<PackageCheck className="h-4 w-4" aria-hidden="true" />}
          tone={metrics.lowStockCount > 0 ? "warning" : "success"}
        />
        <MetricCard
          label="دسته بندی ها"
          value={formatNumber(metrics.categoryCount)}
          helper={`${formatNumber(metrics.featuredProducts)} محصول ویژه`}
          icon={<Boxes className="h-4 w-4" aria-hidden="true" />}
          tone="premium"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <RevenuePanel revenue={metrics.revenue} orders={metrics.orderCount} averageOrder={metrics.averageOrder} />
        <MonthlyTargetPanel revenue={metrics.revenue} target={metrics.monthlyTarget} progress={metrics.monthlyProgress} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.2fr)_minmax(280px,0.75fr)]">
        <TopCategoriesPanel categories={metrics.topCategories} />
        <ConversionPanel orderCount={metrics.orderCount} productCount={metrics.productCount} />
        <TrafficPanel />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)]">
        <RecentOrdersPanel orders={metrics.recentOrders} />
        <LowStockPanel items={metrics.lowStockItems} />
      </section>
    </div>
  );
}

function AdminTabPanel({
  tab,
  data,
  metrics,
  token,
  onChanged,
  productEditor,
}: {
  tab: Exclude<AdminDashboardTab, "dashboard">;
  data: DashboardData;
  metrics: ReturnType<typeof buildMetrics>;
  token: string | null;
  onChanged: () => Promise<void>;
  productEditor: ProductEditorTarget;
}) {
  if (tab === "orders") {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="کل سفارش ها" value={formatNumber(metrics.orderCount)} helper="همه سفارش های ثبت شده" icon={<ClipboardList className="h-4 w-4" />} />
          <MetricCard label="در حال پردازش" value={formatNumber(metrics.processingOrders)} helper="نیازمند پیگیری" icon={<RefreshCw className="h-4 w-4" />} tone="warning" />
          <MetricCard label="فروش پرداخت شده" value={formatPrice(metrics.revenue)} helper={`${formatNumber(metrics.paidOrders)} سفارش`} icon={<WalletCards className="h-4 w-4" />} />
        </section>
        <RecentOrdersPanel orders={data.orders.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 10)} />
      </div>
    );
  }

  if (tab === "products") {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="همه محصولات" value={formatNumber(metrics.productCount)} helper="کاتالوگ فعلی" icon={<PackageSearch className="h-4 w-4" />} />
          <MetricCard label="محصولات فعال" value={formatNumber(metrics.activeProducts)} helper="قابل نمایش در فروشگاه" icon={<PackageCheck className="h-4 w-4" />} tone="success" />
          <MetricCard label="کم موجودی" value={formatNumber(metrics.lowStockCount)} helper="نیازمند تامین" icon={<Boxes className="h-4 w-4" />} tone="warning" />
        </section>
        <ProductCrudPanel token={token} products={data.products} categories={data.categories} onChanged={onChanged} productEditor={productEditor} />
      </div>
    );
  }

  if (tab === "categories") {
    return (
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-2">
          <MetricCard label="دسته بندی ها" value={formatNumber(metrics.categoryCount)} helper="ساختار فعلی فروشگاه" icon={<FolderTree className="h-4 w-4" />} />
          <MetricCard label="محصولات دسته بندی شده" value={formatNumber(metrics.productCount)} helper="براساس کاتالوگ فعلی" icon={<Boxes className="h-4 w-4" />} />
        </section>
        <TopCategoriesPanel categories={metrics.topCategories} />
      </div>
    );
  }

  const planned: Record<typeof tab, { title: string; description: string; icon: typeof MessageSquareText }> = {
    comments: {
      title: "مدیریت دیدگاه ها",
      description: "این تب برای تایید دیدگاه، پاسخ مدیر، گزارش تخلف و حذف دیدگاه آماده می شود.",
      icon: MessageSquareText,
    },
    blog: {
      title: "مدیریت بلاگ",
      description: "این تب برای دسته های بلاگ، نوشته ها، وضعیت پیش نویس و انتشار آماده می شود.",
      icon: Newspaper,
    },
    settings: {
      title: "تنظیمات اپلیکیشن",
      description: "این تب برای تنظیمات عمومی فروشگاه، لوگو، تماس، ارسال و رفتارهای اپلیکیشن آماده می شود.",
      icon: Settings,
    },
    seo: {
      title: "کنترل سئو",
      description: "این تب برای تنظیمات متا، وضعیت صفحات، نقشه سایت و خطاهای سئو آماده می شود.",
      icon: SearchCheck,
    },
  };
  const item = planned[tab];
  const Icon = item.icon;

  return (
    <section className="rounded-md border border-border bg-card p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{item.description}</p>
      <p className="mt-5 text-xs text-muted-foreground">همین صفحه می ماند و فقط تب تغییر می کند.</p>
    </section>
  );
}

function ProductAdminPreview({ products }: { products: Product[] }) {
  const visibleProducts = products.slice(0, 8);

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">محصولات اخیر</h2>
        <span className="text-xs text-muted-foreground">{formatNumber(products.length)} محصول</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-md border border-border">
        {visibleProducts.length === 0 && <p className="p-5 text-sm text-muted-foreground">هنوز محصولی برای نمایش وجود ندارد.</p>}
        {visibleProducts.map((product) => {
          const stock = product.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0);

          return (
            <div key={product.id} className="grid gap-3 border-t border-border px-4 py-3 text-sm first:border-t-0 md:grid-cols-[1fr_140px_110px]">
              <span>
                <span className="block font-semibold text-foreground">{product.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{product.categoryName || "بدون دسته"}</span>
              </span>
              <span className="text-muted-foreground">{product.status}</span>
              <span className="font-semibold text-primary moein-tabular md:text-left">{formatNumber(stock)} عدد</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RevenuePanel({ revenue, orders, averageOrder }: { revenue: number; orders: number; averageOrder: number }) {
  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">تحلیل فروش</h2>
          <p className="mt-1 text-sm text-muted-foreground">نمای فعلی با داده سفارش ها ساخته می شود؛ نمودار زمانی واقعی در فاز Analytics API اضافه می شود.</p>
        </div>
        <Button type="button" variant="secondary" size="sm">
          ۸ روز اخیر
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-5 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
        <MiniStat label="فروش ثبت شده" value={formatPrice(revenue)} />
        <MiniStat label="سفارش ها" value={formatNumber(orders)} />
        <MiniStat label="میانگین سفارش" value={formatPrice(averageOrder)} />
      </div>

      <div className="mt-6 h-64 rounded-md bg-secondary/35 p-4">
        <LineChart revenue={revenueSeries} orders={orderSeries} />
      </div>
    </section>
  );
}

function MonthlyTargetPanel({ revenue, target, progress }: { revenue: number; target: number; progress: number }) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">هدف ماهانه</h2>
          <p className="mt-1 text-sm text-muted-foreground">براساس فروش پرداخت شده فعلی.</p>
        </div>
        <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>

      <div className="mx-auto mt-7 grid h-44 w-44 place-items-center rounded-full" style={{ background: `conic-gradient(hsl(var(--primary)) 0 ${clampedProgress}%, hsl(var(--secondary)) ${clampedProgress}% 100%)` }}>
        <div className="grid h-32 w-32 place-items-center rounded-full bg-card text-center">
          <span className="text-3xl font-semibold text-foreground moein-tabular">{formatNumber(Math.round(clampedProgress))}%</span>
          <span className="text-xs text-muted-foreground">پیشرفت</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-md border border-border text-center text-sm">
        <div className="p-3">
          <p className="text-muted-foreground">هدف</p>
          <p className="mt-1 font-semibold text-foreground moein-tabular">{formatPrice(target)}</p>
        </div>
        <div className="border-r border-border p-3">
          <p className="text-muted-foreground">فروش</p>
          <p className="mt-1 font-semibold text-primary moein-tabular">{formatPrice(revenue)}</p>
        </div>
      </div>
    </section>
  );
}

function TopCategoriesPanel({ categories }: { categories: Array<{ name: string; count: number; share: number }> }) {
  const top = categories.slice(0, 4);
  const gradient =
    top.length > 0
      ? `conic-gradient(hsl(var(--primary)) 0 ${top[0]?.share || 0}%, hsl(var(--luxury-gold)) ${top[0]?.share || 0}% ${(top[0]?.share || 0) + (top[1]?.share || 0)}%, hsl(var(--accent)) ${(top[0]?.share || 0) + (top[1]?.share || 0)}% ${(top[0]?.share || 0) + (top[1]?.share || 0) + (top[2]?.share || 0)}%, hsl(var(--secondary)) ${(top[0]?.share || 0) + (top[1]?.share || 0) + (top[2]?.share || 0)}% 100%)`
      : "hsl(var(--secondary))";

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">دسته های برتر</h2>
        <span className="text-xs text-muted-foreground">براساس تعداد محصول</span>
      </div>

      <div className="mx-auto mt-6 grid h-40 w-40 place-items-center rounded-full" style={{ background: gradient }}>
        <div className="grid h-24 w-24 place-items-center rounded-full bg-card text-center">
          <span className="text-xs text-muted-foreground">کل</span>
          <span className="font-semibold text-foreground moein-tabular">{formatNumber(top.reduce((sum, item) => sum + item.count, 0))}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {top.length === 0 && <p className="text-sm text-muted-foreground">بعد از ساخت دسته بندی و محصول، این بخش کامل می شود.</p>}
        {top.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className={index === 0 ? "h-2.5 w-2.5 rounded-sm bg-primary" : index === 1 ? "h-2.5 w-2.5 rounded-sm bg-luxury-gold" : index === 2 ? "h-2.5 w-2.5 rounded-sm bg-accent" : "h-2.5 w-2.5 rounded-sm bg-secondary"} />
              <span className="truncate text-muted-foreground">{item.name}</span>
            </span>
            <span className="font-semibold text-foreground moein-tabular">{formatNumber(item.count)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConversionPanel({ orderCount, productCount }: { orderCount: number; productCount: number }) {
  const views = Math.max(productCount * 140, orderCount * 22, 120);
  const carts = Math.max(orderCount * 3, Math.round(views * 0.18));
  const checkouts = Math.max(orderCount * 2, Math.round(carts * 0.58));
  const completed = Math.max(orderCount, Math.round(checkouts * 0.62));
  const steps = [
    { label: "بازدید محصول", value: views, helper: "+۹٪" },
    { label: "افزودن به سبد", value: carts, helper: "+۶٪" },
    { label: "شروع پرداخت", value: checkouts, helper: "+۴٪" },
    { label: "خرید کامل", value: completed, helper: "+۷٪" },
  ];
  const max = Math.max(...steps.map((step) => step.value));

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">نرخ تبدیل</h2>
          <p className="mt-1 text-sm text-muted-foreground">نسخه اولیه تخمینی است تا رویدادهای واقعی اضافه شوند.</p>
        </div>
        <Button type="button" variant="secondary" size="sm">
          این هفته
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-6 grid min-h-64 grid-cols-4 items-end gap-3 border-b border-border pb-4">
        {steps.map((step, index) => (
          <div key={step.label} className="flex h-full flex-col justify-end gap-3">
            <div
              className={index === 0 ? "rounded-t-md bg-primary/20" : index === 1 ? "rounded-t-md bg-primary/25" : index === 2 ? "rounded-t-md bg-primary/40" : "rounded-t-md bg-primary/70"}
              style={{ height: `${Math.max(18, (step.value / max) * 78)}%` }}
            />
            <div>
              <p className="text-lg font-semibold text-foreground moein-tabular">{formatNumber(step.value)}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.label}</p>
              <span className="mt-2 inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">{step.helper}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrafficPanel() {
  const sources = [
    { label: "مستقیم", value: 40 },
    { label: "جستجوی گوگل", value: 30 },
    { label: "شبکه های اجتماعی", value: 18 },
    { label: "ارجاع", value: 12 },
  ];

  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">منابع ترافیک</h2>
        <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="mt-6 flex h-14 overflow-hidden rounded-md">
        {sources.map((source, index) => (
          <span
            key={source.label}
            className={index === 0 ? "bg-primary/70" : index === 1 ? "bg-primary/50" : index === 2 ? "bg-primary/25" : "bg-secondary"}
            style={{ width: `${source.value}%` }}
            title={`${source.label} ${source.value}%`}
          />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {sources.map((source) => (
          <div key={source.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{source.label}</span>
            <span className="font-semibold text-foreground moein-tabular">{formatNumber(source.value)}٪</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentOrdersPanel({ orders }: { orders: Order[] }) {
  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">سفارش های اخیر</h2>
        <span className="text-xs text-muted-foreground">{formatNumber(orders.length)} سفارش</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-md border border-border">
        {orders.length === 0 && <p className="p-5 text-sm text-muted-foreground">هنوز سفارشی برای نمایش وجود ندارد.</p>}
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3 border-t border-border px-4 py-3 text-sm first:border-t-0 md:grid-cols-[1fr_120px_130px]">
            <span>
              <span className="block font-semibold text-foreground">{order.orderNumber}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{order.customerName}</span>
            </span>
            <span className="text-muted-foreground">{order.city}</span>
            <span className="font-semibold text-primary moein-tabular md:text-left">{formatPrice(order.total)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LowStockPanel({ items }: { items: Array<{ name: string; variant: string; stock: number }> }) {
  return (
    <section className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">هشدار موجودی</h2>
        <Boxes className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="mt-5 space-y-3">
        {items.length === 0 && <p className="text-sm leading-7 text-muted-foreground">فعلا محصول کم موجودی پیدا نشد.</p>}
        {items.map((item) => (
          <div key={`${item.name}-${item.variant}`} className="rounded-md border border-border bg-background p-3">
            <p className="text-sm font-semibold text-foreground">{item.name}</p>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{item.variant}</span>
              <span className="rounded-md bg-amber-500/10 px-2 py-1 font-semibold text-amber-700">{formatNumber(item.stock)} عدد</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LineChart({ revenue, orders }: { revenue: number[]; orders: number[] }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 640 220" role="img" aria-label="نمودار فروش و سفارش">
      {[35, 80, 125, 170].map((y) => (
        <line key={y} x1="24" x2="616" y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="5 8" />
      ))}
      <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={toPoints(revenue)} />
      <polyline fill="none" stroke="hsl(var(--luxury-gold))" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" strokeLinejoin="round" points={toPoints(orders)} />
      {revenue.map((value, index) => {
        const [x, y] = pointFor(value, index, revenue.length);
        return <circle key={`${value}-${index}`} cx={x} cy={y} r={index === 5 ? 6 : 3} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="3" />;
      })}
    </svg>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground moein-tabular">{value}</p>
    </div>
  );
}

function AccessDenied() {
  return (
    <StatePanel
      tone="permission"
      title="دسترسی مدیریت لازم است"
      description="برای دیدن داشبورد باید با حساب دارای نقش ADMIN یا SUPERADMIN وارد شوید."
      actionLabel="ورود به حساب"
      actionHref="/login"
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-md bg-secondary" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <div className="h-80 animate-pulse rounded-md bg-secondary" />
        <div className="h-80 animate-pulse rounded-md bg-secondary" />
      </div>
      <div className="h-64 animate-pulse rounded-md bg-secondary" />
    </div>
  );
}

function buildMetrics({ orders, products, categories }: DashboardData) {
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const productCount = products.length;
  const activeProducts = products.filter((product) => product.status === "ACTIVE").length;
  const featuredProducts = products.filter((product) => product.featured).length;
  const allVariants = products.flatMap((product) => product.variants.map((variant) => ({ product, variant })));
  const lowStockItems = allVariants
    .filter(({ variant }) => variant.active && variant.stockQuantity <= 3)
    .sort((a, b) => a.variant.stockQuantity - b.variant.stockQuantity)
    .slice(0, 5)
    .map(({ product, variant }) => ({ name: product.name, variant: variant.title, stock: variant.stockQuantity }));
  const flatCategories = flattenCategories(categories);
  const categoryProductCounts = products.reduce<Record<string, number>>((acc, product) => {
    const name = product.categoryName || "بدون دسته";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const totalCategorized = Math.max(1, Object.values(categoryProductCounts).reduce((sum, count) => sum + count, 0));
  const topCategories = Object.entries(categoryProductCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count]) => ({ name, count, share: Math.round((count / totalCategorized) * 100) }));
  const monthlyTarget = Math.max(100_000_000, Math.ceil((revenue || 1) * 1.35));
  const monthlyProgress = revenue > 0 ? (revenue / monthlyTarget) * 100 : 0;

  return {
    revenue,
    paidOrders: paidOrders.length,
    orderCount: orders.length,
    processingOrders: orders.filter((order) => order.status === "PROCESSING").length,
    averageOrder: paidOrders.length > 0 ? Math.round(revenue / paidOrders.length) : 0,
    productCount,
    activeProducts,
    featuredProducts,
    lowStockCount: lowStockItems.length,
    lowStockItems,
    categoryCount: flatCategories.length,
    topCategories,
    monthlyTarget,
    monthlyProgress,
    recentOrders: orders.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5),
  };
}

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children || [])]);
}

function toPoints(values: number[]) {
  return values.map((value, index) => pointFor(value, index, values.length).join(",")).join(" ");
}

function pointFor(value: number, index: number, length: number): [number, number] {
  const x = 34 + index * (572 / Math.max(1, length - 1));
  const y = 198 - value * 1.82;
  return [x, y];
}

function hasAdminRole(roles: Role[]) {
  return roles.includes("ADMIN") || roles.includes("SUPERADMIN");
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}
